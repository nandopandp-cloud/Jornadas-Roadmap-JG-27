"""
Prepara um planeta de massinha dos Exploradores para o giro 3D (eixo vertical),
a partir de VÁRIAS artes do mesmo planeta (frente, laterais, costas), cada uma com o
ângulo em que foi "fotografada" (0° = frente; positivo = o lado da casa vem para a frente).

Ideia: o planeta vira um objeto 3D único.
  • Geometria: uma esfera + um relevo "inflado" a partir da silhueta de cada vista
    (no plano perpendicular a ela): a silhueta conta o quanto os elementos saem.
  • Cor: cada ponto do objeto pega a cor da vista mais próxima do ângulo atual que o
    enxerga. No ângulo de cada vista, o planeta é exatamente aquela arte.
  • As artes geradas por IA não têm geometria exata entre si: o ângulo de cada uma foi
    medido comparando as projeções (ver medir_angulo) e pode ser ajustado à mão.

Gera em public/planetas/<id>/:
  <vista>.webp   cada vista sem a parte horizontal da luz (a que mudaria de lugar ao
                 girar), com o tom do oceano igual ao da frente
  perfil.png     1024×N: altura do relevo (R) e espessura (G) por ângulo, uma linha por vista
e src/prototypes/planetas/<id>.json com centro, raio, enquadramento das vistas e a luz.

Uso (precisa de opencv-python-headless e numpy):
  python scripts/planetas/preparar-planeta.py planeta-01                  gera tudo
  python scripts/planetas/preparar-planeta.py planeta-01 --medir-angulos  só mede em que ângulo
      cada vista foi "fotografada", comparando com a frente (e as costas, se houver)
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

RAIZ = Path(__file__).resolve().parents[2]

PLANETAS = {
    'planeta-01': {
        # (nome, arquivo, ângulo em graus, esfera (cx, cy, raio) em px da arte ou None = medir)
        # Os ângulos seguem o guia (90° e 270°). Medidos pelo conteúdo (--medir-angulos), as
        # laterais geradas dão ≈ 25° e ≈ −75°: estão menos giradas do que deveriam. Testamos os
        # dois: com os ângulos medidos sobra um vão de ~145° borrado entre a direita e as costas;
        # com 90°/270° quase toda a volta fica nítida e só a troca entre vistas fica mais curta.
        'vistas': [
            ('frente', 'public/planetas/planeta-01.png', 0, (155.0, 167.0, 128.5)),
            ('direita', 'public/planetas/planeta-01-direita.png', 90, None),
            ('costas', 'public/planetas/planeta-01-costas.png', 180, None),
            ('esquerda', 'public/planetas/planeta-01-esquerda.png', 270, None),
        ],
        'tamanho_max': 1024,  # vistas maiores são reduzidas para este lado (textura)
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


def medir_angulos(pid):
    """Para cada vista que não é a frente/costas, procura o ângulo em que a projeção dela sobre a
    esfera mais coincide com a da frente (0°) e a das costas (180°). Compara formas grandes
    (imagem borrada) em cor Lab, só onde as duas vistas enxergam a superfície bem de frente."""
    cfg = PLANETAS[pid]
    TW, TH = 360, 180
    lon = ((np.arange(TW) + 0.5) / TW * 2 - 1) * np.pi
    lat = (0.5 - (np.arange(TH) + 0.5) / TH) * np.pi
    LON, LAT = np.meshgrid(lon, lat)
    Px, Py, Pz = np.cos(LAT) * np.sin(LON), np.sin(LAT), np.cos(LAT) * np.cos(LON)
    cache = {}

    def projetar(arq, esfera, alfa):
        if arq not in cache:
            img = cv2.imread(str(RAIZ / arq), cv2.IMREAD_UNCHANGED)
            cx, cy, R = esfera if esfera else medir_esfera(img[:, :, 3])
            cache[arq] = (cv2.GaussianBlur(img.astype(np.float32), (0, 0), R / 60), cx, cy, R)
        img, cx, cy, R = cache[arq]
        a = np.radians(alfa)
        x, z = Px * np.cos(a) + Pz * np.sin(a), -Px * np.sin(a) + Pz * np.cos(a)
        t = cv2.remap(img, (cx + x * R * 0.97).astype(np.float32), (cy - Py * R * 0.97).astype(np.float32), cv2.INTER_LINEAR)
        peso = np.clip((z - 0.35) / 0.4, 0, 1) * (t[:, :, 3] > 200)
        lab = cv2.cvtColor(t[:, :, :3].clip(0, 255).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
        return lab, peso

    refs = [projetar(arq, esf, ang) for _, arq, ang, esf in cfg['vistas'] if ang % 180 == 0]
    for nome, arq, ang, esf in cfg['vistas']:
        if ang % 180 == 0:
            continue
        res = []
        for alfa in range(-180, 180, 5):
            lab, p = projetar(arq, esf, alfa)
            tot = w = 0.0
            for rl, rp in refs:
                m = p * rp
                tot += (np.abs(lab - rl).sum(2) * m).sum()
                w += m.sum()
            if w > 500:
                res.append((tot / w, alfa))
        res.sort()
        print(f'{nome}: configurado {ang}°, melhor coincidência em', ', '.join(f'{a}° ({e:.0f})' for e, a in res[:3]))


def main(pid):
    cfg = PLANETAS[pid]
    vistas = []
    for nome, arq, angulo, esfera in cfg['vistas']:
        img = cv2.imread(str(RAIZ / arq), cv2.IMREAD_UNCHANGED)
        lado = cfg.get('tamanho_max')
        if lado and img.shape[1] > lado:
            img = cv2.resize(img, (lado, lado), interpolation=cv2.INTER_AREA)
        if esfera is None:
            esfera = medir_esfera(img[:, :, 3])
        cx, cy, R = esfera
        print(f'{nome} ({angulo}°): {img.shape[1]} px, centro ({cx:.1f}, {cy:.1f}), raio {R:.1f}')
        vistas.append({'nome': nome, 'arq': arq, 'angulo': angulo, 'img': img, 'cx': cx, 'cy': cy, 'R': R})

    # ---- luz de cada vista: tira a parte horizontal (ela mudaria de lugar ao girar) ----
    for v in vistas:
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
        print(f'  {v["nome"]}: luz horizontal de {Sh[dist < R].min():.2f} a {Sh[dist < R].max():.2f}')

    # ---- equilibra o brilho: o oceano de cada vista fica tão claro quanto o da frente ----
    # (só o brilho: ajustar canal por canal puxava as laterais para o vermelho)
    lum = lambda c: c @ np.array([0.114, 0.587, 0.299])
    ref = np.median(lum(vistas[0]['cor'][vistas[0]['agua']]))
    for v in vistas[1:]:
        ajuste = float(np.clip(ref / max(np.median(lum(v['cor'][v['agua']])), 1), 0.8, 1.25))
        v['cor'] *= ajuste
        print(f'  brilho {v["nome"]}: × {ajuste:.3f}')

    # ---- margem contra estouro dos claros (a textura guarda cor × ganho; o shader desfaz) ----
    picos = [np.percentile(v['cor'][v['img'][:, :, 3] > 200].max(1), 99.8) for v in vistas]
    ganho = float(min(1.0, 252.0 / max(picos)))

    destino = RAIZ / 'public/planetas' / pid
    destino.mkdir(parents=True, exist_ok=True)
    for velho in list(destino.glob('*.png')) + list(destino.glob('*.jpg')) + list(destino.glob('*.webp')):
        velho.unlink()
    for v in vistas:
        saida = v['img'].copy()
        saida[:, :, :3] = (v['cor'] * ganho).clip(0, 255).round().astype(np.uint8)
        # fora da silhueta a cor não importa (alfa 0), mas ajuda o filtro: puxa a cor da borda
        saida[:, :, :3] = np.where(saida[:, :, 3:4] > 0, saida[:, :, :3], cv2.dilate(saida[:, :, :3], np.ones((3, 3), np.uint8)))
        cv2.imwrite(str(destino / f'{v["nome"]}.webp'), saida, [cv2.IMWRITE_WEBP_QUALITY, 92])

    # ---- relevo: a silhueta de cada vista, inflada no plano perpendicular a ela ----
    perfil = np.zeros((len(vistas), N_PERFIL, 4), np.uint8)
    alt_max = 0.0
    for i, v in enumerate(vistas):
        rho = np.maximum(silhueta(v['img'][:, :, 3], v['cx'], v['cy'], v['R']), 1.0)
        suave = np.convolve(np.concatenate([rho[-3:], rho, rho[:3]]), np.ones(7) / 7, 'same')[3:-3]
        rho = np.maximum(suave, rho - 0.004)
        altura = np.clip(rho - 1.0, 0, ALTURA_MAX)
        # meia espessura (rad): fina o bastante para o elemento não virar uma mancha larga de frente
        espessura = np.clip(0.06 + 0.6 * altura, 0.08, 0.32)
        perfil[i, :, 2] = np.round(altura / ALTURA_MAX * 255)  # R (OpenCV grava BGR)
        perfil[i, :, 1] = np.round(espessura / (np.pi / 2) * 255)  # G
        perfil[i, :, 3] = 255
        alt_max = max(alt_max, float(altura.max()))
    cv2.imwrite(str(destino / 'perfil.png'), perfil)
    rho_max = 1 + alt_max + 0.02
    print(f'relevo: altura máx {alt_max:.2f} R, raio do quadro {rho_max:.2f} R')

    f = vistas[0]
    dados = {
        'id': pid,
        'arte': '/'.join(f['arq'].split('/')[1:]),
        'pasta': f'planetas/{pid}',
        'tamanhoArte': f['img'].shape[1],
        'centro': [f['cx'], f['cy']],
        'raio': f['R'],
        'raioQuadro': round(rho_max, 4),
        # vistas: imagem, ângulo (graus) e enquadramento da esfera (centro u, v e raio r, em fração da imagem)
        'vistas': [
            {
                'nome': v['nome'],
                'src': f'{v["nome"]}.webp',
                'angulo': v['angulo'],
                'u': round(v['cx'] / v['img'].shape[1], 5),
                'v': round(v['cy'] / v['img'].shape[0], 5),
                'r': round(v['R'] / v['img'].shape[1], 5),
            }
            for v in vistas
        ],
        'perfil': 'perfil.png',
        'alturaMax': ALTURA_MAX,
        # luz da frente (coeficientes de S(x, y)); o shader devolve a parte horizontal, parada
        'luz': [round(float(x), 5) for x in f['luz']],
        'ganho': round(ganho, 5),
    }
    (RAIZ / f'src/prototypes/planetas/{pid}.json').write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n')
    print('ok:', destino)


if __name__ == '__main__':
    alvo = sys.argv[1] if len(sys.argv) > 1 else 'planeta-01'
    if '--medir-angulos' in sys.argv:
        medir_angulos(alvo)
    else:
        main(alvo)
