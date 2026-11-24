"""Gera o GUIA-ENGENHARIA.pdf do kit a partir do catálogo publicado (public/planetas/catalogo.json)
e dos pôsteres: a grade de planetas da página 2 sai sozinha. Rodar a cada planeta novo:
  python3 scripts/planetas/guia/montar_guia.py
Saída: kit-planetas/GUIA-ENGENHARIA.pdf (e uma cópia em ~/Downloads/PLANETAS 3D/, se a pasta existir).
Precisa de Pillow e do playwright da skill planetas-3d (~/.claude/skills/planetas-3d/node_modules)."""
import base64
import io
import json
import os
import shutil
import subprocess
from pathlib import Path

from PIL import Image

AQUI = Path(__file__).parent
RAIZ = AQUI.parents[2]
PUB = RAIZ / 'public' / 'planetas'
REL = 'https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/releases/download/kit-planetas/'
CAPA = 'planeta-emocoes'


def b64(poster, lado):
    im = Image.open(poster).convert('RGBA').resize((lado, lado), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=88)
    return base64.b64encode(buf.getvalue()).decode()


planetas = json.loads((PUB / 'catalogo.json').read_text())['planetas']
n = len(planetas)
# 4 colunas cabem ids longos (planeta-empreendedorismo) numa linha; a imagem encolhe com o número de linhas
colunas = 4 if n <= 12 else 5
img = 27 if n <= 8 else 20 if n <= 12 else 17
fonte_id = 7 if colunas == 4 else 6
grade = ''.join(
    f'<div class="pl"><img src="data:image/webp;base64,{b64(PUB / p["id"] / p["poster"], 300)}" alt="">'
    f'<b>{p["nome"]}</b><code>{p["id"]}</code></div>'
    for p in planetas)
s = (AQUI / 'guia.html').read_text()
for k, v in {
    '{{CSS}}': (AQUI / 'base.css').read_text(),
    '{{CAPA}}': b64(PUB / CAPA / 'poster.webp', 1000),
    '{{PLANETAS}}': grade, '{{COLUNAS}}': str(colunas), '{{IMG}}': str(img), '{{FONTE_ID}}': str(fonte_id),
    '{{ZIP}}': REL + 'kit-planetas.zip', '{{PDF}}': REL + 'GUIA-ENGENHARIA.pdf',
    '{{ZIP_CURTO}}': 'github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27 › releases › kit-planetas.zip',
}.items():
    s = s.replace(k, v)
assert '{{' not in s
tmp = Path(os.environ.get('TMPDIR', '/tmp')) / 'guia-planetas'
tmp.mkdir(exist_ok=True)
(tmp / 'guia.html').write_text(s)
pdf = RAIZ / 'kit-planetas' / 'GUIA-ENGENHARIA.pdf'
subprocess.run(['node', str(AQUI / 'imprimir.mjs'), str(tmp / 'guia.html'), str(pdf), str(tmp / 'pag')], check=True)
copia = Path.home() / 'Downloads' / 'PLANETAS 3D'
if copia.is_dir():
    shutil.copy(pdf, copia / 'GUIA-ENGENHARIA.pdf')
print(f'{n} planetas · {pdf} · prints em {tmp}/pag-N.png')
