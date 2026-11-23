"""
Prepara um planeta de massinha dos Exploradores para o giro 3D (eixo vertical).

Entrada: várias imagens do MESMO planeta girando no próprio eixo vertical. Pode ser:
  • um STORYBOARD (uma imagem com vários quadros lado a lado, ex.: de 15° em 15°), ou
  • VISTAS soltas (frente, laterais, costas), cada uma num arquivo, com o ângulo.
Quanto mais quadros coerentes, melhor: entre dois quadros vizinhos o planeta gira de
verdade em 3D, e só na metade do caminho um quadro dá lugar ao seguinte.

O que o script faz:
  1. separa os quadros (storyboard) e põe na ordem do giro;
  2. amplia os quadros pequenos com IA (Real-ESRGAN, se instalado);
  3. mede a esfera em cada quadro e normaliza todos (mesmo centro e mesmo raio);
  4. MEDE o ângulo real de cada quadro (comparando quadros vizinhos projetados na
     esfera) e fecha a volta em 360°; descarta quadros repetidos;
  5. mede a luz pintada (no oceano de todos os quadros) e tira a parte horizontal,
     que mudaria de lugar ao girar; equilibra o brilho entre os quadros;
  6. mede o relevo: a silhueta de cada quadro diz quanto os elementos saem da esfera.

Gera em public/planetas/<id>/:
  quadros.webp   todos os quadros normalizados (LADO × LADO cada), em grade de até 6 colunas
  perfil.png     1024×N: altura do relevo (R) e meia espessura (G), uma linha por quadro
  frente.webp    o primeiro quadro, ampliado (arte de reserva e primeiro quadro na tela)
e src/prototypes/planetas/<id>.json, que o componente PlanetaGirando lê.

Uso (opencv-python-headless, numpy; opcional: realesrgan-ncnn-py para ampliar):
  python scripts/planetas/preparar-planeta.py planeta-01            gera tudo
  python scripts/planetas/preparar-planeta.py planeta-01 --quadros  só separa e numera os
      quadros do storyboard (folha em scripts/planetas/.quadros-<id>.png), para definir a ordem
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np

RAIZ = Path(__file__).resolve().parents[2]

PLANETAS = {
    # ---- MONTADO A PARTIR DE PEÇAS (metodologia atual) ----
    # Cada peça é um PNG transparente desenhado de frente. Ela vira um "adesivo" no globo: fica
    # exatamente como desenhada quando passa de frente para a câmera e só gira, aparece e some.
    #   lon, lat  onde fica o centro da peça (graus; lon 0 = frente, positivo = à direita da frente)
    #   giro      gira a peça no próprio plano (graus, anti-horário) para ela ficar de pé
    #   escala    1 = o tamanho que ela tem em relação à bola no kit
    #   altura    quanto ela sai da esfera (em raios); o contorno vira uma cúpula arredondada
    #   espelhar  vira na horizontal (para reaproveitar uma peça do outro lado)
    'planeta-01': {
        'pecas_dir': 'arte/planetas/planeta-01/pecas',
        'base': '01-base-azul.png',
        'pecas': [
            # lado da casa (lon ≈ −90°): cinturão de mata (a peça deitada), cachoeira e casa
            # a floresta é uma faixa alta: deitada (girada 90°) vira um cinturão de mata no lado da casa,
            # com as moitas no tamanho do kit e longe dos polos
            {'arq': '02-floresta.png', 'lon': -150, 'lat': -22, 'giro': 0, 'escala': 0.55, 'altura': 0.05},
            {'arq': '02-floresta.png', 'lon': -122, 'lat': 10, 'giro': 90, 'escala': 0.8, 'altura': 0.06},
            {'arq': '02-floresta.png', 'lon': -82, 'lat': -14, 'giro': 270, 'escala': 0.78, 'altura': 0.06, 'espelhar': True},
            {'arq': '02-floresta.png', 'lon': -96, 'lat': 18, 'giro': 180, 'escala': 0.55, 'altura': 0.06},
            {'arq': '08-cachoeira.png', 'lon': -92, 'lat': -34, 'giro': -10, 'escala': 0.95, 'altura': 0.08},
            {'arq': '04-casa.png', 'lon': -84, 'lat': 34, 'giro': 16, 'escala': 1.0, 'altura': 0.2},
            # topo, puxado para a frente
            {'arq': '03-vulcao-e-pedras.png', 'lon': -26, 'lat': 40, 'giro': 0, 'escala': 0.95, 'altura': 0.18},
            # frente (lon ≈ 0°)
            {'arq': '07-serpente.png', 'lon': -14, 'lat': -34, 'giro': 0, 'escala': 0.85, 'altura': 0.025},
            {'arq': '09-aves.png', 'lon': 16, 'lat': -6, 'giro': 0, 'escala': 0.8, 'altura': 0.03},
            {'arq': '06-barco.png', 'lon': 50, 'lat': 20, 'giro': 0, 'escala': 1.0, 'altura': 0.07},
            # lado do polvo (lon ≈ +90°)
            {'arq': '10-lira.png', 'lon': 92, 'lat': -24, 'giro': 22, 'escala': 1.0, 'altura': 0.1},
            {'arq': '05-polvo.png', 'lon': 108, 'lat': 32, 'giro': 10, 'escala': 0.95, 'altura': 0.12},
            # costas (lon ≈ 180°): um rio
            {'arq': '07-serpente.png', 'lon': 158, 'lat': -20, 'giro': 20, 'escala': 0.9, 'altura': 0.025, 'espelhar': True},
        ],
    },
    # ---- a partir de um STORYBOARD do giro (metodologia anterior, guardada para comparação) ----
    'planeta-01-storyboard': {
        'storyboard': 'arte/planetas/planeta-01/storyboard.png',
        # Ordem do giro (números dos quadros, lendo o storyboard da esquerda para a direita e de
        # cima para baixo, a partir de 0). No storyboard do Planeta 01 os quadros 7 a 14 vieram
        # fora de ordem: 9–14 invertidos e 7–8 (lado do polvo) antes da hora.
        'ordem': [0, 1, 2, 3, 4, 5, 6, 14, 13, 12, 11, 10, 9, 8, 7, 15, 16, 17, 18, 19, 20, 21],
        'chave': ['q00', 'q03', 'q06', 'q13', 'q11', 'q08', 'q16', 'q18'],
        'relevo': 0.8,
    },
}

LADO = 640          # lado de cada quadro normalizado (px)
RAIO = 213          # raio da esfera no quadro normalizado (px): sobra 1,5 R para os elementos
N_PERFIL = 1024
ALTURA_MAX = 0.75   # escala do canal R do perfil (em raios)
GIRO_MIN = 4.0      # quadros a menos de 4° do anterior são repetidos e saem
COLUNAS = 6         # colunas da grade de quadros em quadros.webp


# ---------------------------------------------------------------- quadros
def separar_storyboard(img):
    """Quadros do storyboard, lendo da esquerda para a direita e de cima para baixo.
    Linhas = faixas horizontais com conteúdo (as faixas baixas, de etiqueta, são ignoradas);
    quadros = blocos de colunas com conteúdo dentro de cada linha."""
    a = img[:, :, 3] > 20
    H, W = a.shape
    linhas, y = [], 0
    while y < H:
        if a[y].any():
            j = y
            while j < H and a[j].any():
                j += 1
            linhas.append((y, j))
            y = j
        else:
            y += 1
    altura = max(j - i for i, j in linhas)
    quadros = []
    for y0, y1 in linhas:
        if y1 - y0 < altura * 0.5:  # etiqueta
            continue
        cols = a[y0:y1].any(0)
        x = 0
        while x < W:
            if cols[x]:
                j = x
                while j < W and cols[j:j + 6].any():
                    j += 1
                if j - x > 40:
                    m = 12
                    quadros.append(img[max(0, y0 - m):y1 + m, max(0, x - m):j + m].copy())
                x = j
            else:
                x += 1
    return quadros


_ampliador = None


def ampliar(rgba):
    """Amplia 4× com Real-ESRGAN (x4plus) quando disponível; senão, bicúbico.
    A cor de fora da silhueta é preenchida antes (senão o ampliador inventa franjas) e o
    contorno (alfa) também passa pela IA, para a borda sair nítida."""
    global _ampliador
    rgb, alfa = rgba[:, :, :3].copy(), rgba[:, :, 3]
    fora = (alfa < 8).astype(np.uint8)
    if fora.any():
        _, rot = cv2.distanceTransformWithLabels(fora, cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
        ordem = np.flatnonzero(fora.ravel() == 0)
        tab = np.zeros(rot.max() + 1, np.int64)
        tab[1:len(ordem) + 1] = ordem
        rgb = rgb.reshape(-1, 3)[tab[rot.ravel()]].reshape(rgb.shape)
    try:
        if _ampliador is None:
            from realesrgan_ncnn_py import Realesrgan
            _ampliador = Realesrgan(gpuid=0, model=4)  # realesrgan-x4plus
        g_rgb = _ampliador.process_cv2(rgb)
        g_a = _ampliador.process_cv2(cv2.cvtColor(alfa, cv2.COLOR_GRAY2BGR))[:, :, 1]
    except Exception as erro:  # sem o pacote ou sem GPU: bicúbico
        print('  (ampliação simples:', erro, ')')
        g_rgb = cv2.resize(rgb, None, fx=4, fy=4, interpolation=cv2.INTER_CUBIC)
        g_a = cv2.resize(alfa, None, fx=4, fy=4, interpolation=cv2.INTER_CUBIC)
    return np.dstack([g_rgb, g_a])


def medir_esfera(alfa):
    """Centro e raio da esfera: o círculo que melhor encosta na parte "lisa" da silhueta
    (as peças que saem dela são ignoradas, por ficarem acima do raio típico)."""
    A = alfa > 100
    H, W = A.shape
    ts = np.linspace(0, 2 * np.pi, 360, endpoint=False)
    rr = np.arange(min(H, W) * 0.15, max(H, W) * 0.55, max(0.5, H / 640))

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


def normalizar(rgba, cx, cy, R):
    """Quadro LADO × LADO com a esfera no centro e raio RAIO."""
    s = RAIO / R
    M = np.float32([[s, 0, LADO / 2 - s * cx], [0, s, LADO / 2 - s * cy]])
    filtro = cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC
    return cv2.warpAffine(rgba, M, (LADO, LADO), flags=filtro, borderValue=(0, 0, 0, 0))


# ---------------------------------------------------------------- ângulos
_TW, _TH = 360, 180
_lon = ((np.arange(_TW) + 0.5) / _TW * 2 - 1) * np.pi
_lat = (0.5 - (np.arange(_TH) + 0.5) / _TH) * np.pi
_LON, _LAT = np.meshgrid(_lon, _lat)
_PX, _PY, _PZ = np.cos(_LAT) * np.sin(_LON), np.sin(_LAT), np.cos(_LAT) * np.cos(_LON)


def projetar(q, alfa):
    """Quadro normalizado projetado na esfera, girado de alfa graus (cor Lab, borrado) e o peso
    de cada ponto (só onde o quadro vê a superfície bem de frente)."""
    img = cv2.GaussianBlur(q.astype(np.float32), (0, 0), RAIO / 50)
    a = np.radians(alfa)
    x = _PX * np.cos(a) + _PZ * np.sin(a)
    z = -_PX * np.sin(a) + _PZ * np.cos(a)
    c = LADO / 2
    t = cv2.remap(img, (c + x * RAIO * 0.97).astype(np.float32), (c - _PY * RAIO * 0.97).astype(np.float32), cv2.INTER_LINEAR)
    peso = np.clip((z - 0.3) / 0.4, 0, 1) * (t[:, :, 3] > 200)
    lab = cv2.cvtColor(t[:, :, :3].clip(0, 255).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
    return lab, peso


def giro_entre(qa, qb, maximo=60):
    """Quanto o planeta girou de qa para qb (graus) e o erro da coincidência."""
    la, pa = projetar(qa, 0)
    melhor = (1e9, 0.0)
    for d in np.arange(0, maximo + 0.5, 1.0):
        lb, pb = projetar(qb, d)
        m = pa * pb
        if m.sum() < 800:
            continue
        e = (np.abs(la - lb).sum(2) * m).sum() / m.sum()
        melhor = min(melhor, (e, float(d)))
    return melhor[1], melhor[0]


# ---------------------------------------------------------------- luz e relevo
def ajustar_luz(amostras):
    """Luz pintada nos quadros, medida num material uniforme (o oceano):
    S(x, y) = c0 + c1·x + c2·y + c3·x² + c4·y² + c5·x·y + c6·r⁴ (esfera unitária, y para cima)."""
    x = np.concatenate([a[0] for a in amostras])
    y = np.concatenate([a[1] for a in amostras])
    alvo = np.concatenate([a[2] for a in amostras])
    A = np.stack([np.ones_like(x), x, y, x * x, y * y, x * y, (x * x + y * y) ** 2], 1)
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


def silhueta(alfa):
    """Raio da silhueta (em raios da esfera) para cada ângulo da tela (0 = direita, anti-horário)."""
    fi = (np.arange(N_PERFIL) + 0.5) / N_PERFIL * 2 * np.pi - np.pi
    rr = np.arange(0.5, 1.5, 0.002) * RAIO
    c = LADO / 2
    X = c + rr[None, :] * np.cos(fi)[:, None]
    Y = c - rr[None, :] * np.sin(fi)[:, None]
    a = cv2.remap(alfa.astype(np.float32), X.astype(np.float32), Y.astype(np.float32), cv2.INTER_LINEAR, borderValue=0)
    dentro = a > 110
    idx = np.where(dentro.any(1), dentro.shape[1] - 1 - np.argmax(dentro[:, ::-1], 1), 0)
    return rr[idx] / RAIO


# ---------------------------------------------------------------- planeta único (textura + relevo)
TEX_W, TEX_H = 2048, 1024   # textura 360° (equiretangular)
REL_W, REL_H = 1024, 512    # relevo 360° (equiretangular)


def _direcoes(w, h):
    lon = ((np.arange(w) + 0.5) / w * 2 - 1) * np.pi
    lat = (0.5 - (np.arange(h) + 0.5) / h) * np.pi
    LON, LAT = np.meshgrid(lon, lat)
    return np.cos(LAT) * np.sin(LON), np.sin(LAT), np.cos(LAT) * np.cos(LON)


def construir_relevo(quadros, angulos):
    """Altura dos elementos em cada direção do planeta, a partir das silhuetas.
    A silhueta de um quadro feito no ângulo α mostra o perfil do planeta em dois meridianos:
    lon = 90° − α (borda direita) e lon = −90° − α (borda esquerda). Com N quadros são 2N
    meridianos; entre eles a altura é interpolada, latitude por latitude."""
    lat_rel = (0.5 - (np.arange(REL_H) + 0.5) / REL_H) * np.pi
    meridianos = []  # (lon, alturas por latitude)
    fi = (np.arange(N_PERFIL) + 0.5) / N_PERFIL * 2 * np.pi - np.pi
    for q, a in zip(quadros, angulos):
        rho = np.maximum(silhueta(q[:, :, 3]), 1.0)
        h = np.clip(rho - 1.0, 0, ALTURA_MAX)
        al = np.radians(a)
        # borda direita: φ ∈ [−90°, 90°] → lat = φ
        dir_ = np.abs(fi) <= np.pi / 2
        meridianos.append((np.pi / 2 - al, np.interp(lat_rel, fi[dir_], h[dir_])))
        # borda esquerda: φ ∈ (90°, 180°] → lat = 180° − φ ; φ ∈ [−180°, −90°) → lat = −180° − φ
        esq = ~dir_
        lat_e = np.where(fi[esq] > 0, np.pi - fi[esq], -np.pi - fi[esq])
        ordem = np.argsort(lat_e)
        meridianos.append((-np.pi / 2 - al, np.interp(lat_rel, lat_e[ordem], h[esq][ordem])))
    lons = np.array([(m[0] + np.pi) % (2 * np.pi) - np.pi for m in meridianos])
    alts = np.stack([m[1] for m in meridianos], 1)  # (REL_H, 2N)
    ordem = np.argsort(lons)
    lons, alts = lons[ordem], alts[:, ordem]
    # interpolação periódica em longitude
    lons_p = np.concatenate([lons - 2 * np.pi, lons, lons + 2 * np.pi])
    alts_p = np.concatenate([alts, alts, alts], 1)
    lon_rel = ((np.arange(REL_W) + 0.5) / REL_W * 2 - 1) * np.pi
    H = np.stack([np.interp(lon_rel, lons_p, alts_p[r]) for r in range(REL_H)])
    # suaviza (sem cruzar a emenda de ±180°)
    H = cv2.GaussianBlur(np.concatenate([H[:, -60:], H, H[:, :60]], 1), (0, 0), sigmaX=8.0, sigmaY=3.0)[:, 60:-60]
    return H.astype(np.float32)


def construir_textura(quadros, cores, angulos, H, ganho):
    """Cor de cada direção do planeta: vem do quadro-chave que a vê mais de frente, sem misturar
    (só uma borda estreita entre regiões vizinhas). O ponto é projetado na altura do relevo, então
    os elementos elevados pegam a própria cor. Os polos, que nenhum quadro vê de frente, recebem
    a cor da faixa válida mais próxima."""
    Px, Py, Pz = _direcoes(TEX_W, TEX_H)
    Hg = cv2.resize(H, (TEX_W, TEX_H), interpolation=cv2.INTER_LINEAR)
    c = LADO / 2
    amostras, frontal = [], []
    for q, cor, a in zip(quadros, cores, angulos):
        al = np.radians(a)
        z = -Px * np.sin(al) + Pz * np.cos(al)
        r = 1.0 + Hg
        x = (Px * np.cos(al) + Pz * np.sin(al)) * r
        y = Py * r
        img = np.dstack([(cor * ganho).clip(0, 255), q[:, :, 3]]).astype(np.float32)
        t = cv2.remap(img, (c + x * RAIO).astype(np.float32), (c - y * RAIO).astype(np.float32), cv2.INTER_LINEAR, borderValue=0)
        amostras.append(t)
        frontal.append(np.where(t[:, :, 3] > 128, z, -9.0))
    frontal = np.stack(frontal)
    melhor = frontal.max(0)
    # borda estreita: só quadros a menos de 0,02 de frontalidade do melhor entram, com peso decrescente
    w = np.clip(1 - (melhor[None] - frontal) / 0.02, 0, 1) * (frontal > -1)
    soma = w.sum(0)
    acc = sum(t[:, :, :3] * wi[:, :, None] for t, wi in zip(amostras, w))
    tex = acc / np.maximum(soma, 1e-9)[:, :, None]
    valido = (soma > 0) & (melhor > 0.08)
    # polos: cada coluna recebe a cor da linha válida mais próxima (depois suaviza)
    linhas = np.arange(TEX_H)[:, None].repeat(TEX_W, 1)
    topo = np.where(valido, linhas, TEX_H).min(0)
    base = np.where(valido, linhas, -1).max(0)
    cols = np.arange(TEX_W)
    for col_lim, cond in ((topo, linhas < topo[None]), (base, linhas > base[None])):
        lim = np.clip(col_lim, 0, TEX_H - 1)
        borda = tex[lim, cols]
        tex = np.where(cond[:, :, None], borda[None], tex)
    polo = ~valido
    suave = cv2.GaussianBlur(tex.astype(np.float32), (0, 0), 6)
    peso = cv2.GaussianBlur(polo.astype(np.float32), (0, 0), 4)[:, :, None]
    tex = tex * (1 - peso) + suave * peso
    return tex.clip(0, 255).astype(np.uint8)


# ---------------------------------------------------------------- principal
def carregar_quadros(cfg):
    """Quadros RGBA na ordem do giro, nomes e ângulos (None = medir)."""
    if 'storyboard' in cfg:
        sb = cv2.imread(str(RAIZ / cfg['storyboard']), cv2.IMREAD_UNCHANGED)
        todos = separar_storyboard(sb)
        ordem = cfg.get('ordem', list(range(len(todos))))
        print(f'storyboard: {len(todos)} quadros; ordem {ordem}')
        return [todos[i] for i in ordem], [f'q{i:02d}' for i in ordem], None
    quadros, nomes, angulos = [], [], []
    for nome, arq, ang in cfg['vistas']:
        quadros.append(cv2.imread(str(RAIZ / arq), cv2.IMREAD_UNCHANGED))
        nomes.append(nome)
        angulos.append(float(ang))
    return quadros, nomes, angulos


def main(pid):
    cfg = PLANETAS[pid]
    brutos, nomes, angulos = carregar_quadros(cfg)

    # ---- esfera de cada quadro; amplia os pequenos; normaliza ----
    quadros = []
    for q, nome in zip(brutos, nomes):
        q = cv2.copyMakeBorder(q, 24, 24, 24, 24, cv2.BORDER_CONSTANT, value=(0, 0, 0, 0))
        cx, cy, R = medir_esfera(q[:, :, 3])
        r0 = R
        if R < RAIO * 0.9:
            q = ampliar(q)
            cx, cy, R = medir_esfera(q[:, :, 3])
        quadros.append(normalizar(q, cx, cy, R))
        print(f'  {nome}: raio {r0:.0f} px{" → ampliado 4×" if R > r0 * 2 else ""}')

    # ---- ângulos: medidos entre quadros vizinhos, fechando a volta em 360° ----
    if angulos is None:
        giros = []
        for i in range(len(quadros)):
            d, e = giro_entre(quadros[i], quadros[(i + 1) % len(quadros)])
            giros.append(d)
            alerta = '  ← conteúdo bem diferente entre os quadros' if e > 45 else ''
            print(f'  {nomes[i]} → {nomes[(i + 1) % len(quadros)]}: {d:4.0f}° (erro {e:.0f}){alerta}')
        total = sum(giros)
        print(f'  soma dos giros: {total:.0f}° (perto de 360° = volta completa e ordem certa)')
        giros = [g * 360 / total for g in giros]
        angulos = list(np.concatenate([[0], np.cumsum(giros[:-1])]))
        # repetidos: a menos de GIRO_MIN do anterior saem (fica o primeiro)
        manter = [0] + [i for i in range(1, len(quadros)) if angulos[i] - angulos[i - 1] >= GIRO_MIN]
        if len(manter) > 1 and 360 - angulos[manter[-1]] < GIRO_MIN:
            manter = manter[:-1]
        saem = [nomes[i] for i in range(len(quadros)) if i not in manter]
        if saem:
            print('  repetidos (saem):', ', '.join(saem))
        quadros = [quadros[i] for i in manter]
        nomes = [nomes[i] for i in manter]
        angulos = [angulos[i] for i in manter]
    print('ângulos:', ', '.join(f'{n} {a:.0f}°' for n, a in zip(nomes, angulos)))

    # ---- luz: medida no oceano de todos os quadros juntos; tira a parte horizontal ----
    yy, xx = np.mgrid[0:LADO, 0:LADO]
    gx, gy = (xx - LADO / 2) / RAIO, -(yy - LADO / 2) / RAIO
    dist = np.hypot(gx, gy)
    amostras, aguas = [], []
    for q in quadros:
        hsv = cv2.cvtColor(q[:, :, :3], cv2.COLOR_BGR2HSV)
        hh, ss, vv = (hsv[:, :, i].astype(int) for i in range(3))
        agua = (hh >= 88) & (hh <= 112) & (ss > 60) & (vv > 90) & (q[:, :, 3] > 250) & (dist < 0.95)
        with np.errstate(all='ignore'):
            lum = q[:, :, :3].astype(np.float64) @ np.array([0.114, 0.587, 0.299])
        amostras.append((gx[agua], gy[agua], lum[agua]))
        aguas.append(agua)
    luz = ajustar_luz(amostras)
    Sh = luz_horizontal(luz, gx, gy)
    print(f'luz horizontal de {Sh[dist < 1].min():.2f} a {Sh[dist < 1].max():.2f}')
    cores = [q[:, :, :3].astype(np.float64) / Sh[:, :, None] for q in quadros]

    # ---- brilho: o oceano de cada quadro igual à mediana (evita piscar na troca) ----
    with np.errstate(all='ignore'):
        lumc = lambda c: c @ np.array([0.114, 0.587, 0.299])
        medias = [float(np.median(lumc(c[a]))) if a.sum() > 200 else np.nan for c, a in zip(cores, aguas)]
    ref = np.nanmedian(medias)
    for i, m in enumerate(medias):
        if not np.isnan(m):
            cores[i] *= float(np.clip(ref / m, 0.9, 1.1))

    ganho = float(min(1.0, 252.0 / max(np.percentile(c[q[:, :, 3] > 200].max(1), 99.8) for c, q in zip(cores, quadros))))

    # ---- o planeta único: relevo (das silhuetas) e textura 360° (dos quadros mais de frente) ----
    H = construir_relevo(quadros, angulos) * float(cfg.get('relevo', 1.0))
    chave = [i for i, n in enumerate(nomes) if n in cfg.get('chave', nomes)]
    print('cor dos quadros-chave:', ', '.join(f'{nomes[i]} ({angulos[i]:.0f}°)' for i in chave))
    tex = construir_textura([quadros[i] for i in chave], [cores[i] for i in chave], [angulos[i] for i in chave], H, ganho)
    alt_max = float(H.max())
    print(f'relevo: altura máx {alt_max:.2f} R')

    # ---- grava ----
    destino = RAIZ / 'public/planetas' / pid
    destino.mkdir(parents=True, exist_ok=True)
    for velho in list(destino.glob('*.png')) + list(destino.glob('*.jpg')) + list(destino.glob('*.webp')):
        velho.unlink()
    cv2.imwrite(str(destino / 'textura.webp'), tex, [cv2.IMWRITE_WEBP_QUALITY, 92])
    cv2.imwrite(str(destino / 'relevo.png'), np.round(H / ALTURA_MAX * 255).clip(0, 255).astype(np.uint8))
    cv2.imwrite(str(destino / 'frente.webp'), quadros[0], [cv2.IMWRITE_WEBP_QUALITY, 90])

    dados = {
        'id': pid,
        'arte': f'planetas/{pid}/frente.webp',
        'pasta': f'planetas/{pid}',
        'tamanhoArte': LADO,
        'centro': [LADO / 2, LADO / 2],
        'raio': RAIO,
        'raioQuadro': round(1 + alt_max + 0.02, 4),
        # o planeta único: textura 360° (equiretangular, cor × ganho) e relevo 360° (altura / alturaMax)
        'textura': 'textura.webp',
        'relevo': 'relevo.png',
        'alturaMax': ALTURA_MAX,
        # de onde veio (para conferência)
        'fontes': {n: round(float(a), 1) for n, a in zip(nomes, angulos)},
        # luz pintada nos quadros (coeficientes de S(x, y)); o shader devolve a parte horizontal, parada
        'luz': [round(float(x), 5) for x in luz],
        'ganho': round(ganho, 5),
    }
    (RAIZ / f'src/prototypes/planetas/{pid}.json').write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n')
    print(f'ok: planeta montado a partir de {len(quadros)} quadros em {destino}')


# ---------------------------------------------------------------- montagem a partir de peças
def _cupula(alfa, altura):
    """Relevo de uma peça: o contorno vira uma cúpula arredondada (borda baixa, miolo alto)."""
    dentro = (alfa > 128).astype(np.uint8)
    if not dentro.any():
        return np.zeros(alfa.shape, np.float32)
    d = cv2.distanceTransform(dentro, cv2.DIST_L2, 5)
    rampa = max(4.0, 0.45 * np.sqrt(dentro.sum() / np.pi))
    t = np.clip(d / rampa, 0, 1)
    return (altura * (1 - (1 - t) ** 2)).astype(np.float32)


def montar(pid):
    cfg = PLANETAS[pid]
    pasta = RAIZ / cfg['pecas_dir']
    base = cv2.imread(str(pasta / cfg['base']), cv2.IMREAD_UNCHANGED)
    bcx, bcy, bR = medir_esfera(base[:, :, 3])
    print(f'bola: centro ({bcx:.0f}, {bcy:.0f}), raio {bR:.0f} px')

    # ---- luz da bola (o oceano é a bola inteira) → luz fixa do planeta ----
    H0, W0 = base.shape[:2]
    yy, xx = np.mgrid[0:H0, 0:W0]
    gx, gy = (xx - bcx) / bR, -(yy - bcy) / bR
    dentro = (np.hypot(gx, gy) < 0.95) & (base[:, :, 3] > 250)
    with np.errstate(all='ignore'):
        lum = base[:, :, :3].astype(np.float64) @ np.array([0.114, 0.587, 0.299])
    luz = ajustar_luz([(gx[dentro], gy[dentro], lum[dentro])])
    luz = luz / luz[0]  # S(0, 0) = 1
    S = luz[0] + luz[1] * gx + luz[2] * gy + luz[3] * gx * gx + luz[4] * gy * gy + luz[5] * gx * gy + luz[6] * (gx * gx + gy * gy) ** 2

    # ---- oceano 360°: cor da bola sem a luz + o granulado da massinha, repetido sem emenda ----
    albedo = base[:, :, :3].astype(np.float32) / np.clip(S, 0.3, 2)[:, :, None].astype(np.float32)
    cor_oceano = np.median(albedo[dentro], 0)
    m = int(bR * 0.45)
    remendo = albedo[int(bcy) - m:int(bcy) + m, int(bcx) - m:int(bcx) + m]
    grao = remendo - cv2.GaussianBlur(remendo, (0, 0), 6)
    ladrilho = np.vstack([np.hstack([grao, grao[:, ::-1]]), np.hstack([grao[::-1], grao[::-1, ::-1]])])
    px_por_rad = TEX_W / (2 * np.pi)
    ladrilho = cv2.resize(ladrilho, None, fx=px_por_rad / bR, fy=px_por_rad / bR, interpolation=cv2.INTER_CUBIC)
    reps = (TEX_H // ladrilho.shape[0] + 1, TEX_W // ladrilho.shape[1] + 1, 1)
    tex = (cor_oceano[None, None, :] + np.tile(ladrilho, reps)[:TEX_H, :TEX_W]).astype(np.float32)
    rel = np.zeros((TEX_H, TEX_W), np.float32)

    # ---- peças coladas no globo, na ordem da lista (as de baixo primeiro) ----
    lon = ((np.arange(TEX_W) + 0.5) / TEX_W * 2 - 1) * np.pi
    lat = (0.5 - (np.arange(TEX_H) + 0.5) / TEX_H) * np.pi
    LON, LAT = np.meshgrid(lon, lat)
    for p in cfg['pecas']:
        img = cv2.imread(str(pasta / p['arq']), cv2.IMREAD_UNCHANGED).astype(np.float32)
        al = img[:, :, 3]
        x0, y0, w, h = cv2.boundingRect((al > 20).astype(np.uint8))
        ax, ay = x0 + w / 2, y0 + h / 2
        relevo_peca = _cupula(al, p.get('altura', 0.0))
        lon0, lat0 = np.radians(p['lon']), np.radians(p['lat'])
        dlon = (LON - lon0 + np.pi) % (2 * np.pi) - np.pi
        # coordenadas da peça: u = arco para leste; v = altura na tela (a câmera fica sempre no
        # equador, então assim a peça aparece exatamente como desenhada quando está de frente)
        u = dlon * np.cos(LAT)
        v = np.sin(LAT) - np.sin(lat0)
        if p.get('espelhar'):
            u = -u
        g = np.radians(-p.get('giro', 0.0))
        ur, vr = u * np.cos(g) - v * np.sin(g), u * np.sin(g) + v * np.cos(g)
        esc = bR / p.get('escala', 1.0)  # px da peça por raio: escala 0,5 = metade do tamanho
        mx = (ax + ur * esc).astype(np.float32)
        my = (ay - vr * esc).astype(np.float32)
        # a peça vale numa calota em volta do centro: some suavemente a mais de 76° de distância
        # (medida pela superfície da esfera, então não há corte em linha reta) e perto dos polos,
        # onde esticaria (acima de 72° de latitude)
        dist = np.arccos(np.clip(np.sin(LAT) * np.sin(lat0) + np.cos(LAT) * np.cos(lat0) * np.cos(dlon), -1, 1))
        frente = np.clip((np.radians(88) - dist) / np.radians(12), 0, 1) * np.clip((np.radians(80) - np.abs(LAT)) / np.radians(8), 0, 1)
        amostra = cv2.remap(img, mx, my, cv2.INTER_CUBIC, borderValue=0)
        hpeca = cv2.remap(relevo_peca, mx, my, cv2.INTER_LINEAR, borderValue=0)
        a = (amostra[:, :, 3:4] / 255.0).clip(0, 1) * frente[:, :, None]
        tex = amostra[:, :, :3] * a + tex * (1 - a)
        rel = np.maximum(rel, hpeca * np.clip(a[:, :, 0] * 2 - 0.5, 0, 1))
        print(f'  {p["arq"]}: lon {p["lon"]}°, lat {p["lat"]}°')
    rel = cv2.GaussianBlur(rel, (0, 0), 1.2)
    rel = cv2.resize(rel, (REL_W, REL_H), interpolation=cv2.INTER_AREA)
    tex = tex.clip(0, 255).astype(np.uint8)

    # ---- imagem de reserva: o planeta visto de frente (sem relevo), com a luz da bola ----
    yy, xx = np.mgrid[0:LADO, 0:LADO]
    qx, qy = (xx - LADO / 2) / RAIO, -(yy - LADO / 2) / RAIO
    r2 = qx * qx + qy * qy
    z = np.sqrt(np.clip(1 - r2, 0, 1))
    tu = ((np.arctan2(qx, z) / (2 * np.pi) + 0.5) * TEX_W - 0.5).astype(np.float32)
    tv = ((0.5 - np.arcsin(np.clip(qy, -1, 1)) / np.pi) * TEX_H - 0.5).astype(np.float32)
    frente_img = cv2.remap(tex, tu, tv, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP).astype(np.float32)
    Sq = luz[0] + luz[1] * qx + luz[2] * qy + luz[3] * qx * qx + luz[4] * qy * qy + luz[5] * qx * qy + luz[6] * r2 ** 2
    frente_img *= np.clip(Sq, 0.5, 1.3)[:, :, None]
    alfa = (np.clip((1 - np.sqrt(r2)) * RAIO / 1.5 + 0.5, 0, 1) * 255).astype(np.uint8)
    frente_img = np.dstack([frente_img.clip(0, 255).astype(np.uint8), alfa])

    destino = RAIZ / 'public/planetas' / pid
    destino.mkdir(parents=True, exist_ok=True)
    for velho in list(destino.glob('*.png')) + list(destino.glob('*.jpg')) + list(destino.glob('*.webp')):
        velho.unlink()
    cv2.imwrite(str(destino / 'textura.webp'), tex, [cv2.IMWRITE_WEBP_QUALITY, 92])
    cv2.imwrite(str(destino / 'relevo.png'), np.round(rel / ALTURA_MAX * 255).clip(0, 255).astype(np.uint8))
    cv2.imwrite(str(destino / 'frente.webp'), frente_img, [cv2.IMWRITE_WEBP_QUALITY, 90])
    alt_max = float(rel.max())
    dados = {
        'id': pid,
        'arte': f'planetas/{pid}/frente.webp',
        'pasta': f'planetas/{pid}',
        'tamanhoArte': LADO,
        'centro': [LADO / 2, LADO / 2],
        'raio': RAIO,
        'raioQuadro': round(1 + alt_max + 0.02, 4),
        'textura': 'textura.webp',
        'relevo': 'relevo.png',
        'alturaMax': ALTURA_MAX,
        # luz da bola, completa (a textura é só cor): S(x, y) / S(0, 0)
        'luz': [round(float(x), 5) for x in luz],
        'luzCompleta': True,
        'ganho': 1.0,
    }
    (RAIZ / f'src/prototypes/planetas/{pid}.json').write_text(json.dumps(dados, ensure_ascii=False, indent=2) + '\n')
    print(f'ok: planeta montado com {len(cfg["pecas"])} peças em {destino}')


def folha_de_quadros(pid):
    """Separa os quadros do storyboard e grava uma folha numerada, para definir a ordem."""
    cfg = PLANETAS[pid]
    sb = cv2.imread(str(RAIZ / cfg['storyboard']), cv2.IMREAD_UNCHANGED)
    qs = separar_storyboard(sb)
    tiles = []
    for k, q in enumerate(qs):
        t = np.full((260, 260, 3), (60, 30, 40), np.uint8)
        s = 240 / max(q.shape[:2])
        r = cv2.resize(q, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        a = r[:, :, 3:4] / 255
        h, w = r.shape[:2]
        t[10:10 + h, 10:10 + w] = (r[:, :, :3] * a + t[10:10 + h, 10:10 + w] * (1 - a)).astype(np.uint8)
        cv2.putText(t, str(k), (6, 24), 0, 0.8, (255, 255, 255), 2)
        tiles.append(t)
    while len(tiles) % 6:
        tiles.append(np.zeros((260, 260, 3), np.uint8))
    saida = RAIZ / f'scripts/planetas/.quadros-{pid}.png'
    cv2.imwrite(str(saida), np.vstack([np.hstack(tiles[i:i + 6]) for i in range(0, len(tiles), 6)]))
    print(f'{len(qs)} quadros → {saida}')


if __name__ == '__main__':
    alvo = sys.argv[1] if len(sys.argv) > 1 else 'planeta-01'
    if '--quadros' in sys.argv:
        folha_de_quadros(alvo)
    elif 'pecas' in PLANETAS[alvo]:
        montar(alvo)
    else:
        main(alvo)
