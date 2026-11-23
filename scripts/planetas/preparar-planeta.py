"""
Prepara um planeta de massinha dos Exploradores para o giro 3D (eixo vertical).

A partir de UMA arte de frente (PNG com fundo transparente), gera:
  1. textura.jpg    — mapa equiretangular 360° da esfera (2:1). A faixa central
     da frente (±45°) é a arte exata; perto da borda a arte é comprimida demais,
     então o mapeamento aperta suavemente. O lado de trás é o espelho da frente,
     o que deixa a emenda invisível.
  2. elementos.png  — os elementos que saem da silhueta (casa, polvo…), recortados
     na posição original. Eles ficam PARADOS por cima da esfera, com as mesmas
     proporções da arte; só a esfera gira. Na textura, o lugar deles é preenchido
     com água (difusão só da água em volta) ou com relevo clonado do mato vizinho.
  3. <id>.json      — centro, raio e arquivos, lidos pelo componente.

Uso (precisa de opencv-python-headless e numpy):
  python scripts/planetas/preparar-planeta.py planeta-01

Para um planeta novo: inclua um bloco em PLANETAS com centro/raio da esfera
(em px da arte) e a caixa de cada elemento que sai da esfera.
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

RAIZ = Path(__file__).resolve().parents[2]

PLANETAS = {
    'planeta-01': {
        'arte': 'public/planetas/planeta-01.png',
        'centro': (155.0, 167.0),
        'raio': 128.5,
        # mapeamento: até 45° de longitude é a arte exata; em 90° usa a arte em 78°
        'lon_exata': 45.0,
        'lon_borda': 78.0,
        'elementos': {
            # nome: caixa (x0, y0, x1, y1) em px da arte, tipo de recorte e como preencher o lugar na esfera
            #   'agua'              → difusão só a partir da água em volta (o oceano de massinha é liso)
            #   ('clonar', dx, dy)  → copia o relevo de (x+dx, y+dy) com emenda Poisson (mato, árvores)
            'casa': {'caixa': (12, 40, 104, 128), 'tipo': 'quente', 'preencher': ('clonar', 22, 66)},
            'caverna': {'caixa': (108, 10, 192, 66), 'tipo': 'nao-agua', 'preencher': 'agua'},
            'polvo': {'caixa': (210, 30, 304, 140), 'tipo': 'roxo', 'preencher': 'agua'},
            'ilha': {'caixa': (212, 148, 318, 272), 'tipo': 'nao-agua', 'preencher': 'agua'},
        },
        # objetos da esfera que aparecem só uma vez (no espelho de trás eles somem)
        # elipse (cx, cy, rx, ry) em px da arte, cobrindo o objeto inteiro com a marola
        'so_na_frente': [(237, 127, 38, 39)],  # barco
        # vista de trás, se o time de arte tiver (deixa o lado de trás único):
        # 'costas': {'arte': 'public/planetas/planeta-01-costas.png', 'centro': (160, 160), 'raio': 128},
    },
}

TEX_W, TEX_H = 1024, 512


def maior_componente(m):
    n, rot, est, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8), 8)
    if n <= 1:
        return m
    i = 1 + int(np.argmax(est[1:, cv2.CC_STAT_AREA]))
    return rot == i


def preencher_buracos(m):
    m8 = m.astype(np.uint8) * 255
    h, w = m8.shape
    borda = np.zeros((h + 2, w + 2), np.uint8)
    fora = m8.copy()
    cv2.floodFill(fora, borda, (0, 0), 255)
    return (m8 > 0) | (fora == 0)


def difundir(bgr, desconhecido, passos=260):
    """Preenche por difusão: cor do pixel conhecido mais próximo, suavizada só dentro da área."""
    m = desconhecido.astype(np.uint8)
    _, rotulos = cv2.distanceTransformWithLabels(m, cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
    ordem = np.flatnonzero(m.ravel() == 0)
    tab = np.zeros(rotulos.max() + 1, dtype=np.int64)
    tab[1:len(ordem) + 1] = ordem
    out = bgr.reshape(-1, 3)[tab[rotulos.ravel()]].reshape(bgr.shape).astype(np.float32)
    out[~desconhecido] = bgr[~desconhecido]
    for _ in range(passos):
        suave = cv2.GaussianBlur(out, (0, 0), 2.2)
        out[desconhecido] = suave[desconhecido]
    return out.clip(0, 255).astype(np.uint8)


def preencher(bgr, fora, buracos, agua):
    """Fora da esfera: difusão (só serve de margem para a amostragem).
    Buracos: água → difusão só a partir da água; ('clonar', dx, dy) → relevo copiado com emenda Poisson."""
    out = difundir(bgr, fora | np.any([m for m, _ in buracos], axis=0) if buracos else fora)
    todos = np.any([m for m, _ in buracos], axis=0) if buracos else np.zeros(fora.shape, bool)
    for m, modo in buracos:
        if not m.any():
            continue
        if modo == 'agua':
            fonte = agua & ~fora & ~todos
            cheio = difundir(bgr, ~fonte, passos=400)
            peso = cv2.GaussianBlur(cv2.dilate(m.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(np.float32), (0, 0), 2.0)[:, :, None]
            out = (cheio * peso + out * (1 - peso)).clip(0, 255).astype(np.uint8)
        else:
            _, dx, dy = modo
            # fonte[y, x] = bgr[y + dy, x + dx]
            fonte = cv2.warpAffine(bgr, np.float32([[1, 0, -dx], [0, 1, -dy]]), (bgr.shape[1], bgr.shape[0]), borderMode=cv2.BORDER_REFLECT)
            ys, xs = np.nonzero(m)
            centro = (int((xs.min() + xs.max() + 1) // 2), int((ys.min() + ys.max() + 1) // 2))
            mm = (cv2.dilate(m.astype(np.uint8), np.ones((3, 3), np.uint8)) * 255)
            out = cv2.seamlessClone(fonte, out, mm, centro, cv2.NORMAL_CLONE)
    return out


def ajustar_luz(bgr, fonte, cx, cy, R):
    """Mede a luz que já vem pintada na arte, usando um material uniforme (o oceano).
    Modelo suave na tela: S(x, y) = c0 + c1·x + c2·y + c3·x² + c4·y² + c5·x·y + c6·r⁴
    (x, y na esfera unitária, y para cima). Ajuste robusto (descarta o rio e reflexos)."""
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


def avaliar_luz(c, x, y):
    return c[0] + c[1] * x + c[2] * y + c[3] * x * x + c[4] * y * y + c[5] * x * y + c[6] * (x * x + y * y) ** 2


def luz_horizontal(c, x, y):
    """Só a parte da luz que muda na horizontal: S(x, y) / S(0, y).
    No giro vertical cada ponto fica sempre na mesma altura da tela, então a luz de cima
    para baixo nunca se move e pode continuar pintada na textura."""
    return np.clip(avaliar_luz(c, x, y) / np.maximum(avaliar_luz(c, 0 * x, y), 1e-3), 0.5, 1.5)


def uniformizar_agua_tras(tex, lon):
    """No lado de trás (só preenchimentos e espelho), tira as manchas de claro/escuro da água:
    a luminosidade de baixa frequência de cada linha vai para a mediana da linha.
    Mantém o granulado fino da massinha. A frente (|lon| < 95°) não muda."""
    hsv = cv2.cvtColor(tex, cv2.COLOR_BGR2HSV)
    aguaT = ((hsv[:, :, 0] >= 80) & (hsv[:, :, 0] <= 125) & (hsv[:, :, 1] > 25)).astype(np.float32)
    lum = tex.astype(np.float32) @ np.float32([0.114, 0.587, 0.299])
    num = cv2.GaussianBlur(lum * aguaT, (0, 0), 14)
    den = cv2.GaussianBlur(aguaT, (0, 0), 14)
    baixa = num / np.maximum(den, 1e-3)
    rampa = np.clip((np.abs(lon) - np.radians(95)) / np.radians(20), 0, 1)
    rampa = rampa * rampa * (3 - 2 * rampa)
    tras = rampa[None, :] > 0.5
    perfil = np.array([np.median(lum[i][(aguaT[i] > 0) & tras[0]]) if ((aguaT[i] > 0) & tras[0]).sum() > 20 else np.nan for i in range(tex.shape[0])])
    ok = ~np.isnan(perfil)
    perfil = np.interp(np.arange(len(perfil)), np.flatnonzero(ok), perfil[ok])
    perfil = cv2.GaussianBlur(perfil.astype(np.float32)[:, None], (0, 0), 6)[:, 0]
    fator = np.clip(perfil[:, None] / np.maximum(baixa, 1), 0.8, 1.25)
    peso = rampa[None, :] * cv2.GaussianBlur(aguaT, (0, 0), 1.5)
    return (tex.astype(np.float32) * (1 + (fator - 1) * peso)[:, :, None]).clip(0, 255).astype(np.uint8)


def mapear_lon(lon, exata, borda):
    """Longitude da textura → longitude na arte: identidade até `exata`, aperta até `borda` em 90°."""
    a, b = np.radians(exata), np.radians(borda)
    c = (np.pi / 2 - b) / (np.pi / 2 - a) ** 2
    ex = np.maximum(0, np.abs(lon) - a)
    return np.sign(lon) * (np.abs(lon) - c * ex ** 2)


def main(pid):
    cfg = PLANETAS[pid]
    img = cv2.imread(str(RAIZ / cfg['arte']), cv2.IMREAD_UNCHANGED)
    H, W = img.shape[:2]
    bgr, alfa = img[:, :, :3], img[:, :, 3]
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    hh, ss, vv = (hsv[:, :, i].astype(int) for i in range(3))
    cx, cy = cfg['centro']
    R = cfg['raio']
    yy, xx = np.mgrid[0:H, 0:W]
    dist = np.hypot(xx - cx, yy - cy)

    agua = (hh >= 80) & (hh <= 125) & (ss > 25) & (vv > 60)
    verde = (hh >= 30) & (hh <= 90) & (ss > 40)
    opaco = alfa > 40

    destino = RAIZ / 'public/planetas' / pid
    destino.mkdir(parents=True, exist_ok=True)
    for velho in destino.glob('*.png'):
        velho.unlink()

    todos = np.zeros((H, W), bool)
    por_elemento = []
    for nome, p in cfg['elementos'].items():
        x0, y0, x1, y1 = p['caixa']
        caixa = np.zeros((H, W), bool)
        caixa[y0:y1, x0:x1] = True
        if p['tipo'] == 'quente':
            m = ((hh <= 25) | (hh >= 165)) & (ss > 60)
        elif p['tipo'] == 'roxo':
            m = (hh >= 118) & (hh <= 172) & (ss > 35)
        else:
            m = ~agua & ~verde
        # o que já está fora da esfera dentro da caixa é sempre do elemento
        m = (m | (dist > R + 1)) & opaco & caixa
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8)) > 0
        m = preencher_buracos(maior_componente(m))
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)) > 0
        m = preencher_buracos(m) & opaco & caixa
        todos |= m
        por_elemento.append((m, p.get('preencher', 'agua')))
        print(f'{nome}: {int(m.sum())} px')

    # camada estática: arte original só onde há elemento, com borda macia (sem franja do fundo)
    suave = cv2.GaussianBlur(todos.astype(np.float32), (0, 0), 0.6)
    suave = np.where(todos, np.maximum(suave, 0.5), suave * 0.6)
    camada = img.copy()
    camada[:, :, 3] = (alfa.astype(np.float32) * suave).clip(0, 255).astype(np.uint8)
    cv2.imwrite(str(destino / 'elementos.png'), camada, [cv2.IMWRITE_PNG_COMPRESSION, 9])

    # separa a luz pintada na arte da cor do material: a textura gira com a cor pura
    # e o shader devolve a mesma luz, parada (no ângulo 0 o planeta fica igual à arte)
    fora = (dist > R - 1.5) | (alfa < 245)
    perto = cv2.dilate(todos.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
    luz = ajustar_luz(bgr, agua & (dist < R * 0.97) & ~perto & ~fora, cx, cy, R)
    gx, gy = (xx - cx) / R, -(yy - cy) / R
    disco_in = (gx * gx + gy * gy) <= 1
    Sh = luz_horizontal(luz, gx, gy)
    cor = bgr.astype(np.float64) / Sh[:, :, None]
    # margem para não estourar os claros (a textura guarda cor × ganho; o shader desfaz)
    ganho = float(min(1.0, 252.0 / np.percentile(cor[disco_in & ~fora].max(1), 99.8)))
    print('luz:', ' '.join(f'{v:+.3f}' for v in luz), f'| horizontal de {Sh[disco_in].min():.2f} a {Sh[disco_in].max():.2f} | ganho {ganho:.3f}')
    bgr = (cor * ganho).clip(0, 255).round().astype(np.uint8)

    # esfera sem os elementos
    dil = lambda m, k=5: cv2.dilate(m.astype(np.uint8), np.ones((k, k), np.uint8)) > 0
    buracos = [(dil(m) & ~fora, modo) for m, modo in por_elemento]
    limpo = preencher(bgr, fora, buracos, agua)
    limpo_tras = limpo
    if cfg.get('so_na_frente') and not cfg.get('costas'):
        extra = np.zeros((H, W), bool)
        for ex, ey, rx, ry in cfg['so_na_frente']:
            extra |= ((xx - ex) / rx) ** 2 + ((yy - ey) / ry) ** 2 <= 1
        limpo_tras = preencher(bgr, fora, buracos + [(extra & ~fora, 'agua')], agua)

    # textura equiretangular
    u = (np.arange(TEX_W) + 0.5) / TEX_W
    v = (np.arange(TEX_H) + 0.5) / TEX_H
    lon = (u - 0.5) * 2 * np.pi
    lat = (0.5 - v) * np.pi
    frente = np.abs(lon) <= np.pi / 2
    lon_f = np.where(frente, lon, np.sign(lon) * np.pi - lon)  # trás = espelho da frente
    LON, LAT = np.meshgrid(mapear_lon(lon_f, cfg['lon_exata'], cfg['lon_borda']), lat)
    mx = (cx + R * 0.995 * np.cos(LAT) * np.sin(LON)).astype(np.float32)
    my = (cy - R * 0.995 * np.sin(LAT)).astype(np.float32)

    def projetar(fonte, mx, my):
        g = cv2.resize(fonte, (fonte.shape[1] * 4, fonte.shape[0] * 4), interpolation=cv2.INTER_LANCZOS4)
        return cv2.remap(g, mx * 4 + 1.5, my * 4 + 1.5, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)

    tex = projetar(limpo, mx, my)
    if limpo_tras is not limpo:
        # entra aos poucos depois da emenda (92° → 112°), senão um objeto que cruza a borda vira uma linha
        w = np.clip((np.abs(lon) - np.radians(92)) / np.radians(20), 0, 1)
        w = (w * w * (3 - 2 * w))[None, :, None]
        tex = (tex * (1 - w) + projetar(limpo_tras, mx, my) * w).clip(0, 255).astype(np.uint8)
    if cfg.get('costas'):
        c = cfg['costas']
        tras = cv2.imread(str(RAIZ / c['arte']), cv2.IMREAD_UNCHANGED)
        th, tw = tras.shape[:2]
        tyy, txx = np.mgrid[0:th, 0:tw]
        tfora = (np.hypot(txx - c['centro'][0], tyy - c['centro'][1]) > c['raio'] - 1.5) | (tras[:, :, 3] < 245)
        tgx, tgy = (txx - c['centro'][0]) / c['raio'], -(tyy - c['centro'][1]) / c['raio']
        tS = luz_horizontal(luz, tgx, tgy)[:, :, None]
        tlimpo = difundir((tras[:, :, :3].astype(np.float64) / tS * ganho).clip(0, 255).astype(np.uint8), tfora)
        tx = (c['centro'][0] - c['raio'] * 0.995 * np.cos(LAT) * np.sin(LON)).astype(np.float32)
        ty = (c['centro'][1] - c['raio'] * 0.995 * np.sin(LAT)).astype(np.float32)
        tex[:, ~frente] = projetar(tlimpo, tx, ty)[:, ~frente]
    if not cfg.get('costas'):
        tex = uniformizar_agua_tras(tex, lon)
    cv2.imwrite(str(destino / 'textura.jpg'), tex, [cv2.IMWRITE_JPEG_QUALITY, 92])

    dados = {
        'id': pid,
        'arte': '/'.join(cfg['arte'].split('/')[1:]),
        'pasta': f'planetas/{pid}',
        'tamanhoArte': W,
        'centro': [cx, cy],
        'raio': R,
        'textura': 'textura.jpg',
        'elementos': 'elementos.png',
        # luz pintada na arte (coeficientes de S(x, y)); o shader devolve a parte horizontal, parada
        'luz': [round(float(v), 5) for v in luz],
        'ganho': round(ganho, 5),
    }
    (RAIZ / f'src/prototypes/planetas/{pid}.json').write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n')
    if len(sys.argv) > 2 and sys.argv[2] == '--depurar':
        cv2.imwrite(sys.argv[3] if len(sys.argv) > 3 else f'{pid}-limpo.png', limpo)
    print('ok:', destino)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'planeta-01')
