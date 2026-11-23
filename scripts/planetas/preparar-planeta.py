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
    'planeta-01': {
        'storyboard': 'public/planetas/planeta-01-storyboard.png',
        # Ordem do giro (números dos quadros, lendo o storyboard da esquerda para a direita e de
        # cima para baixo, a partir de 0). No storyboard do Planeta 01 os quadros 7 a 14 vieram
        # fora de ordem: 9–14 invertidos e 7–8 (lado do polvo) antes da hora. A ordem abaixo
        # segue o conteúdo e fecha a volta (os giros medidos somam ≈ 360°).
        'ordem': [0, 1, 2, 3, 4, 5, 6, 14, 13, 12, 11, 10, 9, 8, 7, 15, 16, 17, 18, 19, 20, 21],
        # Quadros-chave da COR: cada região do planeta vem inteira de um deles (o que a vê mais de
        # frente). Escolhidos para que cada elemento fique no centro de um quadro: frente (q00),
        # casa e floresta (q06), costas (q11), polvo e ilha (q16) e os intermediários.
        # Misturar todos os quadros borra os elementos: cada quadro gerado os desenha diferente.
        'chave': ['q00', 'q03', 'q06', 'q13', 'q11', 'q08', 'q16', 'q18'],
        # quanto do relevo medido nas silhuetas entra no planeta (1 = tudo)
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
    else:
        main(alvo)
