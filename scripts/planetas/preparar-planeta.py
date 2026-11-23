"""
Prepara um planeta de massinha dos Exploradores para o giro 3D (eixo vertical),
a partir de DUAS artes: a vista de frente e a vista de trás (PNG transparentes).

Ideia: o planeta vira um objeto 3D único.
  • Geometria: uma esfera + um relevo "inflado" a partir das silhuetas. Os elementos
    que saem da esfera (casa, polvo, ilha, rochedo) ficam na borda das duas vistas,
    então a silhueta conta o quanto eles saem; o relevo tem espessura arredondada.
  • Cor: cada ponto do objeto pega a cor da vista que o enxerga (frente ou costas).
    A 0° o planeta é exatamente a arte da frente; a 180°, exatamente a de trás.

Gera em public/planetas/<id>/:
  frente.webp, costas.webp  as duas vistas sem a parte horizontal da luz (a luz que
                            mudaria de lugar ao girar), com as cores das duas equilibradas
  perfil.png                1024×1: altura do relevo (R) e espessura (G) por ângulo
e src/prototypes/planetas/<id>.json com centro, raio, enquadramento das vistas e a luz.

Uso (precisa de opencv-python-headless e numpy):
  python scripts/planetas/preparar-planeta.py planeta-01
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

RAIZ = Path(__file__).resolve().parents[2]

PLANETAS = {
    'planeta-01': {
        'frente': 'public/planetas/planeta-01.png',
        'costas': 'public/planetas/planeta-01-costas.png',
        # centro e raio da esfera em cada arte (px); None = medir sozinho pela silhueta
        'esfera_frente': (155.0, 167.0, 128.5),
        'esfera_costas': None,
        'tamanho_costas': 1024,  # a vista de trás é reduzida para este lado (textura)
    },
}

N_PERFIL = 1024
ALTURA_MAX = 0.75  # escala do canal R do perfil (em raios)


def medir_esfera(alfa):
    """Centro e raio da esfera: o círculo que melhor encosta na parte "lisa" da silhueta
    (as peças que saem dela são ignoradas, por ficarem acima do raio típico)."""
    A = alfa > 100
    H, W = A.shape
    ts = np.linspace(0, 2 * np.pi, 360, endpoint=False)
    rr = np.arange(H * 0.15, H * 0.55, max(0.5, H / 640))

    def perfil(cx, cy):
        X = np.round(cx + rr[None, :] * np.cos(ts)[:, None]).astype(int)
        Y = np.round(cy - rr[None, :] * np.sin(ts)[:, None]).astype(int)
        ok = (X >= 0) & (X < W) & (Y >= 0) & (Y < H)
        v = np.zeros(ok.shape, bool)
        v[ok] = A[Y[ok], X[ok]]
        idx = np.where(v.any(1), v.shape[1] - 1 - np.argmax(v[:, ::-1], 1), 0)
        return rr[idx]

    melhor = None
    for passo, faixa in ((W / 100, 0.08), (W / 400, 0.012)):
        base = (W / 2, H / 2) if melhor is None else (melhor[1], melhor[2])
        for cx in np.arange(base[0] - W * faixa, base[0] + W * faixa, passo):
            for cy in np.arange(base[1] - H * faixa, base[1] + H * faixa, passo):
                p = np.sort(perfil(cx, cy))[:200]
                if melhor is None or p.std() < melhor[0]:
                    melhor = (p.std(), cx, cy, float(np.median(p)))
    return melhor[1], melhor[2], melhor[3]


def ajustar_luz(bgr, fonte, cx, cy, R):
    """Mede a luz pintada na arte usando um material uniforme (o oceano).
    S(x, y) = c0 + c1·x + c2·y + c3·x² + c4·y² + c5·x·y + c6·r⁴ (esfera unitária, y para cima)."""
    with np.errstate(all='ignore'):
        lum = bgr.astype(np.float64) @ np.array([0.114, 0.587, 0.299])
    ys, xs = np.nonzero(fonte)
    x, y = (xs - cx) / R, -(ys - cy) / R
    A = np.stack([np.ones_like(x), x, y, x * x, y * y, x * y, (x * x + y * y) ** 2], 1)
    alvo = lum[ys, xs]
    manter = np.ones(len(alvo), bool)
    # (o numpy 2.0 com o Accelerate do macOS acende avisos falsos no matmul; os valores estão certos)
    with np.errstate(all='ignore'):
        for _ in range(4):
            c, *_ = np.linalg.lstsq(A[manter], alvo[manter], rcond=None)
            res = alvo - A @ c
            manter = np.abs(res) < 2 * res[manter].std()
    return c


def luz_horizontal(c, x, y):
    """Só a parte da luz que muda na horizontal: S(x, y) / S(0, y). No giro vertical cada
    ponto fica sempre na mesma altura da tela, então a luz de cima para baixo nunca se move."""
    x = np.clip(x, -1, 1)
    y = np.clip(y, -1, 1)
    s = c[0] + c[1] * x + c[2] * y + c[3] * x * x + c[4] * y * y + c[5] * x * y + c[6] * (x * x + y * y) ** 2
    s0 = c[0] + c[2] * y + c[4] * y * y + c[6] * y ** 4
    return np.clip(s / np.maximum(s0, 1e-3), 0.5, 1.5)


def silhueta(alfa, cx, cy, R):
    """Raio da silhueta (em raios da esfera) para cada ângulo da tela (0 = direita, anti-horário)."""
    fi = (np.arange(N_PERFIL) + 0.5) / N_PERFIL * 2 * np.pi - np.pi
    rr = np.arange(0.5, 1.9, 0.002) * R
    X = cx + rr[None, :] * np.cos(fi)[:, None]
    Y = cy - rr[None, :] * np.sin(fi)[:, None]
    a = cv2.remap(alfa.astype(np.float32), X.astype(np.float32), Y.astype(np.float32), cv2.INTER_LINEAR, borderValue=0)
    dentro = a > 110
    idx = np.where(dentro.any(1), dentro.shape[1] - 1 - np.argmax(dentro[:, ::-1], 1), 0)
    return rr[idx] / R


def main(pid):
    cfg = PLANETAS[pid]
    vistas = {}
    for nome in ('frente', 'costas'):
        img = cv2.imread(str(RAIZ / cfg[nome]), cv2.IMREAD_UNCHANGED)
        if nome == 'costas' and cfg.get('tamanho_costas') and img.shape[1] > cfg['tamanho_costas']:
            lado = cfg['tamanho_costas']
            img = cv2.resize(img, (lado, lado), interpolation=cv2.INTER_AREA)
        alfa = img[:, :, 3]
        esfera = cfg.get(f'esfera_{nome}')
        if esfera is None:
            esfera = medir_esfera(alfa)
        cx, cy, R = esfera
        print(f'{nome}: {img.shape[1]} px, centro ({cx:.1f}, {cy:.1f}), raio {R:.1f}')
        vistas[nome] = {'img': img, 'cx': cx, 'cy': cy, 'R': R}

    # ---- luz de cada vista: tira a parte horizontal (ela mudaria de lugar ao girar) ----
    for nome, v in vistas.items():
        img, cx, cy, R = v['img'], v['cx'], v['cy'], v['R']
        H, W = img.shape[:2]
        hsv = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2HSV)
        hh, ss, vv = (hsv[:, :, i].astype(int) for i in range(3))
        yy, xx = np.mgrid[0:H, 0:W]
        dist = np.hypot(xx - cx, yy - cy)
        agua = (hh >= 88) & (hh <= 112) & (ss > 60) & (vv > 90) & (img[:, :, 3] > 250) & (dist < R * 0.95)
        c = ajustar_luz(img[:, :, :3], agua, cx, cy, R)
        Sh = luz_horizontal(c, (xx - cx) / R, -(yy - cy) / R)
        v['luz'] = c
        v['cor'] = img[:, :, :3].astype(np.float64) / Sh[:, :, None]
        v['agua'] = agua
        print(f'  luz horizontal de {Sh[dist < R].min():.2f} a {Sh[dist < R].max():.2f}')

    # ---- equilibra as cores: o oceano das costas fica com o mesmo tom do da frente ----
    ref = np.median(vistas['frente']['cor'][vistas['frente']['agua']], 0)
    alvo = np.median(vistas['costas']['cor'][vistas['costas']['agua']], 0)
    ajuste = np.clip(ref / np.maximum(alvo, 1), 0.8, 1.25)
    vistas['costas']['cor'] *= ajuste[None, None, :]
    print('ajuste de cor das costas (B, G, R):', ' '.join(f'{a:.3f}' for a in ajuste))

    # ---- margem contra estouro dos claros (a textura guarda cor × ganho; o shader desfaz) ----
    picos = [np.percentile(v['cor'][v['img'][:, :, 3] > 200].max(1), 99.8) for v in vistas.values()]
    ganho = float(min(1.0, 252.0 / max(picos)))

    destino = RAIZ / 'public/planetas' / pid
    destino.mkdir(parents=True, exist_ok=True)
    for velho in list(destino.glob('*.png')) + list(destino.glob('*.jpg')) + list(destino.glob('*.webp')):
        velho.unlink()
    for nome, v in vistas.items():
        saida = v['img'].copy()
        saida[:, :, :3] = (v['cor'] * ganho).clip(0, 255).round().astype(np.uint8)
        # fora da silhueta a cor não importa (alfa 0), mas ajuda o filtro: puxa a cor da borda
        saida[:, :, :3] = np.where(saida[:, :, 3:4] > 0, saida[:, :, :3], cv2.dilate(saida[:, :, :3], np.ones((3, 3), np.uint8)))
        cv2.imwrite(str(destino / f'{nome}.webp'), saida, [cv2.IMWRITE_WEBP_QUALITY, 92])

    # ---- relevo: silhueta da frente e da de trás espelhada, no mesmo plano ----
    f, c = vistas['frente'], vistas['costas']
    rf = silhueta(f['img'][:, :, 3], f['cx'], f['cy'], f['R'])
    rc = silhueta(c['img'][:, :, 3], c['cx'], c['cy'], c['R'])
    # ângulo fi na frente = ângulo (π − fi) na vista de trás
    idx = (N_PERFIL - 1 - np.arange(N_PERFIL)) % N_PERFIL
    bruto = np.maximum(np.maximum(rf, rc[idx]), 1.0)
    rho = np.convolve(np.concatenate([bruto[-3:], bruto, bruto[:3]]), np.ones(7) / 7, 'same')[3:-3]
    rho = np.maximum(rho, bruto - 0.004)
    altura = np.clip(rho - 1.0, 0, ALTURA_MAX)
    # meia espessura (rad): fina o bastante para o elemento não virar uma mancha larga quando aponta para a câmera
    espessura = np.clip(0.06 + 0.6 * altura, 0.08, 0.32)
    perfil = np.zeros((1, N_PERFIL, 4), np.uint8)
    perfil[0, :, 2] = np.round(altura / ALTURA_MAX * 255)  # R (OpenCV grava BGR)
    perfil[0, :, 1] = np.round(espessura / (np.pi / 2) * 255)  # G
    perfil[0, :, 3] = 255
    cv2.imwrite(str(destino / 'perfil.png'), perfil)
    rho_max = float(1 + altura.max() + 0.02)
    print(f'relevo: altura máx {altura.max():.2f} R, raio do quadro {rho_max:.2f} R')

    def enquadramento(v):
        H, W = v['img'].shape[:2]
        return {'u': round(v['cx'] / W, 5), 'v': round(v['cy'] / H, 5), 'r': round(v['R'] / W, 5)}

    fW = f['img'].shape[1]
    dados = {
        'id': pid,
        'arte': '/'.join(cfg['frente'].split('/')[1:]),
        'pasta': f'planetas/{pid}',
        'tamanhoArte': fW,
        'centro': [f['cx'], f['cy']],
        'raio': f['R'],
        'raioQuadro': round(rho_max, 4),
        'frente': {'src': 'frente.webp', **enquadramento(f)},
        'costas': {'src': 'costas.webp', **enquadramento(c)},
        'perfil': 'perfil.png',
        'alturaMax': ALTURA_MAX,
        # luz da frente (coeficientes de S(x, y)); o shader devolve a parte horizontal, parada
        'luz': [round(float(x), 5) for x in f['luz']],
        'ganho': round(ganho, 5),
    }
    (RAIZ / f'src/prototypes/planetas/{pid}.json').write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n')
    print('ok:', destino)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'planeta-01')
