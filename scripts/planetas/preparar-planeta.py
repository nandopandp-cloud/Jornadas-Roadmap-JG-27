"""
Prepara um planeta de massinha dos Exploradores para o giro 3D (eixo vertical).

A partir de UMA arte de frente (PNG com fundo transparente), gera:
  1. textura.jpg  — mapa equiretangular 360° da esfera (2:1). O lado da frente
     vem da arte; o lado de trás é o espelho da frente, o que deixa a emenda
     invisível nas duas bordas.
  2. <peca>.png   — os elementos que saem da silhueta (casa, polvo…), recortados.
     Eles viram peças 3D separadas que dão a volta com o planeta. Na textura,
     o lugar de cada peça é preenchido (inpaint) com o que está em volta.
  3. <id>.json    — centro, raio e peças (caixa, ponto de apoio, lon/lat na esfera).

Uso (precisa de opencv-python-headless e numpy):
  python scripts/planetas/preparar-planeta.py planeta-01

Para um planeta novo: inclua um bloco em PLANETAS com centro/raio da esfera
(em px da arte) e a caixa + ponto de apoio de cada elemento que sai da esfera.
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
        # só usa a frente até ±76,5° de longitude: perto da borda a arte é comprimida demais
        'k': 0.85,
        # objetos da esfera que aparecem só uma vez (no espelho de trás eles somem)
        'so_na_frente': [(200, 88, 274, 164)],  # barco
        # 'costas': {'arte': 'public/planetas/planeta-01-costas.png', 'centro': (160, 160), 'raio': 128},
        'pecas': {
            # nome: caixa (x0, y0, x1, y1), apoio (x, y) na superfície, tipo de recorte
            'casa': {'caixa': (12, 40, 104, 128), 'apoio': (84, 112), 'tipo': 'quente'},
            'caverna': {'caixa': (108, 10, 192, 66), 'apoio': (150, 60), 'tipo': 'nao-agua'},
            'polvo': {'caixa': (210, 30, 304, 140), 'apoio': (248, 94), 'tipo': 'roxo'},
            'ilha': {'caixa': (212, 148, 318, 272), 'apoio': (262, 212), 'tipo': 'nao-agua'},
        },
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


def preencher(bgr, desconhecido, passos=260):
    """Preenche a área desconhecida por difusão: começa com a cor do pixel conhecido
    mais próximo e suaviza só dentro da área. Não puxa cor de fora nem escurece."""
    m = desconhecido.astype(np.uint8)
    _, rotulos = cv2.distanceTransformWithLabels(m, cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
    conhecidos = np.argwhere(m == 0)
    # rótulo i (1..n) = i-ésimo pixel zero na ordem de varredura
    ordem = np.flatnonzero(m.ravel() == 0)
    tab = np.zeros(rotulos.max() + 1, dtype=np.int64)
    tab[1:len(ordem) + 1] = ordem
    del conhecidos
    out = bgr.reshape(-1, 3)[tab[rotulos.ravel()]].reshape(bgr.shape).astype(np.float32)
    out[~desconhecido] = bgr[~desconhecido]
    for _ in range(passos):
        suave = cv2.GaussianBlur(out, (0, 0), 2.2)
        out[desconhecido] = suave[desconhecido]
    return out.clip(0, 255).astype(np.uint8)


def mascara_objeto(hh, ss, caixa_xy, agua, opaco, H, W):
    x0, y0, x1, y1 = caixa_xy
    caixa = np.zeros((H, W), bool)
    caixa[y0:y1, x0:x1] = True
    m = ~agua & opaco & caixa
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)) > 0
    m = preencher_buracos(m)
    return cv2.dilate(m.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0


def main(pid):
    cfg = PLANETAS[pid]
    img = cv2.imread(str(RAIZ / cfg['arte']), cv2.IMREAD_UNCHANGED)
    H, W = img.shape[:2]
    bgr, alfa = img[:, :, :3], img[:, :, 3]
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    hh, ss = hsv[:, :, 0].astype(int), hsv[:, :, 1].astype(int)
    cx, cy = cfg['centro']
    R = cfg['raio']
    yy, xx = np.mgrid[0:H, 0:W]
    dist = np.hypot(xx - cx, yy - cy)
    disco = dist <= R

    agua = (hh >= 86) & (hh <= 122) & (ss > 60)
    verde = (hh >= 30) & (hh <= 90) & (ss > 40)
    opaco = alfa > 40

    destino = RAIZ / 'public/planetas' / pid
    destino.mkdir(parents=True, exist_ok=True)
    buraco = np.zeros((H, W), bool)
    pecas = []
    for nome, p in cfg['pecas'].items():
        x0, y0, x1, y1 = p['caixa']
        caixa = np.zeros((H, W), bool)
        caixa[y0:y1, x0:x1] = True
        if p['tipo'] == 'quente':
            m = ((hh <= 25) | (hh >= 165)) & (ss > 60)
        elif p['tipo'] == 'roxo':
            m = (hh >= 118) & (hh <= 172) & (ss > 35)
        else:
            m = ~agua & ~verde
        # o que já está fora da esfera dentro da caixa é sempre da peça
        m = (m | (dist > R + 1)) & opaco & caixa
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8)) > 0
        m = maior_componente(m)
        m = preencher_buracos(m)
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)) > 0
        m = preencher_buracos(m) & opaco & caixa
        m = cv2.dilate(m.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
        m &= opaco
        buraco |= cv2.dilate(m.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0

        suave = cv2.GaussianBlur(m.astype(np.float32), (3, 3), 0.7)
        ys, xs = np.nonzero(m)
        bx0, by0, bx1, by1 = xs.min() - 1, ys.min() - 1, xs.max() + 2, ys.max() + 2
        rgba = img[by0:by1, bx0:bx1].copy()
        rgba[:, :, 3] = (rgba[:, :, 3].astype(np.float32) * suave[by0:by1, bx0:bx1]).clip(0, 255).astype(np.uint8)
        cv2.imwrite(str(destino / f'{nome}.png'), rgba)

        # ponto de apoio → coordenadas na esfera (y para cima), já na escala da textura (lon / k)
        ax, ay = p['apoio']
        nx, ny = (ax - cx) / R, -(ay - cy) / R
        lat = float(np.arcsin(np.clip(ny, -1, 1)))
        lon_src = float(np.arcsin(np.clip(nx / max(np.cos(lat), 1e-6), -1, 1)))
        pecas.append({
            'nome': nome,
            'src': f'{nome}.png',
            'x': int(bx0), 'y': int(by0), 'w': int(bx1 - bx0), 'h': int(by1 - by0),
            'apoio': [ax, ay],
            'lon': round(lon_src / cfg['k'], 5),
            'lat': round(lat, 5),
        })
        print(f'{nome}: caixa {bx0},{by0} {bx1 - bx0}×{by1 - by0}  lon {np.degrees(lon_src / cfg["k"]):.1f}°  lat {np.degrees(lat):.1f}°')

    # preenche o lugar das peças na esfera só com o que está dentro dela
    # (o lado de fora também entra na máscara, para não puxar cor das peças nem do fundo transparente)
    desconhecido = buraco | (dist > R - 1.5) | (alfa < 245)
    limpo = preencher(bgr, desconhecido)
    # lado de trás (espelho): tira objetos que ficariam repetidos “de frente um para o outro”
    limpo_tras = limpo
    if cfg.get('so_na_frente'):
        extra = np.zeros((H, W), bool)
        for cx_ in cfg['so_na_frente']:
            extra |= mascara_objeto(hh, ss, cx_, agua, opaco, H, W)
        limpo_tras = preencher(bgr, desconhecido | extra)

    # textura equiretangular: frente = arte, trás = espelho da frente
    u = (np.arange(TEX_W) + 0.5) / TEX_W
    v = (np.arange(TEX_H) + 0.5) / TEX_H
    lon = (u - 0.5) * 2 * np.pi
    lat = (0.5 - v) * np.pi
    frente = np.abs(lon) <= np.pi / 2
    costas = cfg.get('costas')
    # costas: com uma arte de trás, o lado de trás vem dela (vista de trás = espelhada); sem ela, espelho da frente
    lon = np.where(frente, lon, np.sign(lon) * np.pi - lon)
    lon_s = lon * cfg['k']
    LON, LAT = np.meshgrid(lon_s, lat)
    mx = (cx + R * 0.995 * np.cos(LAT) * np.sin(LON)).astype(np.float32)
    my = (cy - R * 0.995 * np.sin(LAT)).astype(np.float32)
    grande = cv2.resize(limpo, (W * 4, H * 4), interpolation=cv2.INTER_LANCZOS4)
    tex = cv2.remap(grande, mx * 4 + 1.5, my * 4 + 1.5, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    if limpo_tras is not limpo and not costas:
        gt = cv2.resize(limpo_tras, (W * 4, H * 4), interpolation=cv2.INTER_LANCZOS4)
        tt = cv2.remap(gt, mx * 4 + 1.5, my * 4 + 1.5, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
        tex[:, ~frente] = tt[:, ~frente]
    if costas:
        tras = cv2.imread(str(RAIZ / costas['arte']), cv2.IMREAD_UNCHANGED)
        tcx, tcy = costas['centro']
        tR = costas['raio']
        tdist = np.hypot(*np.mgrid[0:tras.shape[0], 0:tras.shape[1]][::-1] - np.array([tcx, tcy])[:, None, None])
        tlimpo = cv2.inpaint(tras[:, :, :3], (tdist > tR - 1.5).astype(np.uint8) * 255, 9, cv2.INPAINT_TELEA)
        tg = cv2.resize(tlimpo, (tras.shape[1] * 4, tras.shape[0] * 4), interpolation=cv2.INTER_LANCZOS4)
        tx = (tcx - tR * 0.995 * np.cos(LAT) * np.sin(LON)).astype(np.float32)
        ty = (tcy - tR * 0.995 * np.sin(LAT)).astype(np.float32)
        tt = cv2.remap(tg, tx * 4 + 1.5, ty * 4 + 1.5, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
        tex[:, ~frente] = tt[:, ~frente]
    # clareia de leve a faixa que vinha da borda escura da arte (vira o meio quando gira)
    perto_borda = np.hypot(np.cos(LAT) * np.sin(LON), 0) ** 6
    tex = (tex.astype(np.float32) * (1 + 0.10 * perto_borda[:, :, None])).clip(0, 255).astype(np.uint8)
    cv2.imwrite(str(destino / 'textura.jpg'), tex, [cv2.IMWRITE_JPEG_QUALITY, 92])

    dados = {
        'id': pid,
        'arte': '/'.join(cfg['arte'].split('/')[1:]),
        'pasta': f'planetas/{pid}',
        'tamanhoArte': W,
        'centro': [cx, cy],
        'raio': R,
        'textura': 'textura.jpg',
        'pecas': pecas,
    }
    (RAIZ / f'src/prototypes/planetas/{pid}.json').write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n')
    print('ok:', destino)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'planeta-01')
