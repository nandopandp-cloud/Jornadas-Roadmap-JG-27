"""Prepara um planeta gerado em 3D (ex.: Tripo) para girar na web.

  python ~/.claude/skills/blender-core/scripts/run_in_blender.py scripts/otimizar_glb.py -- \
      --entrada "NOVOS-PLANETAS/miniature planet 3d model.glb" --saida <pasta de saída> \
      [--tris 160000] [--textura 2048] [--qualidade 86]

O que faz, nesta ordem:
  1. Importa o .glb e junta tudo numa malha (o Tripo já entrega uma só).
  2. Mede a ESFERA do planeta (ajuste robusto por mínimos quadrados: descarta os vértices dos
     elementos que saem dela) e põe o centro dela na origem, com raio 1. Assim o planeta gira
     em volta do próprio centro, sem bambolear.
  3. Reduz os triângulos (Decimate, colapso de arestas, preserva UV) para o orçamento da web.
  4. Reduz as texturas (4K → 2K) e exporta em WebP, com malha comprimida por meshopt.
  5. Renderiza o pôster (imagem de reserva e primeiro quadro) no mesmo enquadramento do site.
Grava planeta.glb, poster.webp e info.json na pasta de saída e imprime a LINHA DO CATÁLOGO
(components/planetas/planetas.ts) pronta para colar. Opcional: --id planeta-02 --nome "Planeta 02".
"""
import json
import math
import os
import sys
import time

import bpy
import numpy as np
from mathutils import Matrix, Vector

a = sys.argv[sys.argv.index('--') + 1:]
arg = lambda k, d=None: a[a.index(k) + 1] if k in a else d
ENTRADA, SAIDA = arg('--entrada'), arg('--saida')
TRIS = int(arg('--tris', 160000))
TEX = int(arg('--textura', 2048))
QUAL = int(arg('--qualidade', 86))
os.makedirs(SAIDA, exist_ok=True)
t0 = time.time()

for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)
bpy.ops.import_scene.gltf(filepath=ENTRADA)
malhas = [o for o in bpy.context.scene.objects if o.type == 'MESH']
ob = malhas[0]
if len(malhas) > 1:
    with bpy.context.temp_override(active_object=ob, selected_editable_objects=malhas, selected_objects=malhas):
        bpy.ops.object.join()
ob.name = 'SM_Planeta'
for o in list(bpy.context.scene.objects):
    if o is not ob:
        bpy.data.objects.remove(o, do_unlink=True)
for m in list(bpy.data.materials):  # materiais sem uso que vieram no arquivo
    if m.users == 0 or m.name in ('Dots Stroke', 'Material'):
        if m.name not in [s.material.name for s in ob.material_slots if s.material]:
            bpy.data.materials.remove(m)
tris_orig = sum(len(p.vertices) - 2 for p in ob.data.polygons)

# ---- 2. esfera: mínimos quadrados robusto (o oceano domina a superfície)
co = np.empty(len(ob.data.vertices) * 3)
ob.data.vertices.foreach_get('co', co)
P = (np.array(ob.matrix_world) @ np.c_[co.reshape(-1, 3), np.ones(len(co) // 3)].T).T[:, :3]
amostra = P[np.random.default_rng(0).choice(len(P), min(len(P), 200000), replace=False)]
manter = np.ones(len(amostra), bool)
for _ in range(8):
    Q = amostra[manter]
    A = np.c_[2 * Q, np.ones(len(Q))]
    b = (Q ** 2).sum(1)
    x, *_ = np.linalg.lstsq(A, b, rcond=None)
    c = x[:3]
    r = math.sqrt(x[3] + c @ c)
    d = np.linalg.norm(amostra - c, axis=1) - r
    manter = np.abs(d) < max(0.004 * r, np.percentile(np.abs(d), 45))
centro, raio = Vector(c), r
fora = float((d > 0.02 * r).mean())
ob.matrix_world = Matrix.Scale(1 / raio, 4) @ Matrix.Translation(-centro) @ ob.matrix_world
with bpy.context.temp_override(active_object=ob, selected_editable_objects=[ob], selected_objects=[ob]):
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

# ---- 3. orçamento de triângulos
dec = ob.modifiers.new('Reduzir', 'DECIMATE')
dec.decimate_type = 'COLLAPSE'
dec.ratio = min(1.0, TRIS / tris_orig)
dec.use_collapse_triangulate = True
with bpy.context.temp_override(object=ob, active_object=ob):
    bpy.ops.object.modifier_apply(modifier=dec.name)
ob.data.polygons.foreach_set('use_smooth', [True] * len(ob.data.polygons))
tris_final = sum(len(p.vertices) - 2 for p in ob.data.polygons)
pts = [Vector(v) for v in ob.bound_box]
caixa = [[round(min(p[i] for p in pts), 3) for i in range(3)], [round(max(p[i] for p in pts), 3) for i in range(3)]]
raio_quadro = max(v.co.length for v in ob.data.vertices)

# ---- 4. texturas
for img in bpy.data.images:
    if img.size[0] > TEX:
        img.scale(TEX, TEX)
bpy.ops.export_scene.gltf(
    filepath=os.path.join(SAIDA, 'planeta.glb'), export_format='GLB', use_selection=False,
    export_image_format='WEBP', export_image_quality=QUAL, export_meshopt_compression_enable=True,
    export_apply=True, export_yup=True, export_texcoords=True, export_normals=True, export_materials='EXPORT',
    export_cameras=False, export_lights=False, export_animations=False)

# ---- 5. pôster: mesmo enquadramento do site (câmera em perspectiva, levemente de cima)
cena = bpy.context.scene
cena.render.engine = 'CYCLES'
prefs = bpy.context.preferences.addons['cycles'].preferences
try:
    prefs.compute_device_type = 'METAL'
    prefs.get_devices()
    for dv in prefs.devices:
        dv.use = dv.type == 'METAL'
    cena.cycles.device = 'GPU'
except Exception:
    pass
cena.cycles.samples = 96
cena.cycles.use_denoising = True
cena.render.film_transparent = True
cena.render.resolution_x = cena.render.resolution_y = 1024
cena.render.image_settings.file_format = 'WEBP'
cena.render.image_settings.quality = 88
cena.render.image_settings.color_mode = 'RGBA'
cena.view_settings.view_transform = 'AgX'
mundo = bpy.data.worlds.new('W')
cena.world = mundo
bg = next(n for n in mundo.node_tree.nodes if n.type == 'BACKGROUND')
bg.inputs['Color'].default_value = (1, 1, 1, 1)
bg.inputs['Strength'].default_value = 0.9
for nome, d, e in (('Sol', (-1.0, -1.1, 1.3), 3.2), ('Preench', (1.2, -0.7, 0.1), 1.0)):
    ld = bpy.data.lights.new(nome, 'SUN')
    ld.energy = e
    ld.angle = math.radians(12)
    lo = bpy.data.objects.new(nome, ld)
    cena.collection.objects.link(lo)
    lo.rotation_euler = Vector(d).to_track_quat('Z', 'Y').to_euler()
INICIO = float(arg('--inicio', 35))       # graus: ângulo do planeta no primeiro quadro
ELEV = float(arg('--elevacao', 12))       # graus: câmera um pouco acima do equador
FOV = 30.0
dist = raio_quadro / math.sin(math.radians(FOV / 2)) * 1.04
cd = bpy.data.cameras.new('CAM')
cd.angle = math.radians(FOV)
cam = bpy.data.objects.new('CAM', cd)
cena.collection.objects.link(cam)
e = math.radians(ELEV)
cam.location = (0, -dist * math.cos(e), dist * math.sin(e))
cam.rotation_euler = (-cam.location).to_track_quat('-Z', 'Y').to_euler()
cena.camera = cam
# o importador glTF deixa o objeto em quatérnio: sem trocar o modo, rotation_euler é ignorado
ob.rotation_mode = 'XYZ'
ob.rotation_euler = (0, 0, math.radians(INICIO))  # mesmo ângulo e mesmo sentido do pivo.rotation.y do site
cena.render.filepath = os.path.join(SAIDA, 'poster.webp')
bpy.ops.render.render(write_still=True)

info = {
    'origem': os.path.basename(ENTRADA), 'tris_original': tris_orig, 'tris': tris_final,
    'esfera_original': {'centro': [round(v, 4) for v in centro], 'raio': round(raio, 4), 'fracao_fora_da_esfera': round(fora, 3)},
    'raio_quadro': round(raio_quadro, 4), 'caixa': caixa, 'textura_px': TEX, 'inicio_graus': INICIO, 'elevacao_graus': ELEV,
    'fov_graus': FOV, 'glb_bytes': os.path.getsize(os.path.join(SAIDA, 'planeta.glb')),
    'poster_bytes': os.path.getsize(os.path.join(SAIDA, 'poster.webp')), 'segundos': round(time.time() - t0, 1),
}
json.dump(info, open(os.path.join(SAIDA, 'info.json'), 'w'), ensure_ascii=False, indent=2)
PID = arg('--id', os.path.basename(os.path.normpath(SAIDA)))
NOME = arg('--nome', PID.replace('-', ' ').title())
info['linha_catalogo'] = (f"  '{PID}': {{ id: '{PID}', nome: '{NOME}', pasta: 'planetas/{PID}', modelo: 'planeta.glb', "
                          f"poster: 'poster.webp', raioQuadro: {round(raio_quadro, 3)}, inicio: {INICIO:g}, elevacao: {ELEV:g}, fov: {FOV:g} }},")
json.dump(info, open(os.path.join(SAIDA, 'info.json'), 'w'), ensure_ascii=False, indent=2)
print('\nCole esta linha em components/planetas/planetas.ts:\n' + info['linha_catalogo'] + '\n')
print('@@JSON@@' + json.dumps(info, ensure_ascii=False))
