#!/usr/bin/env bash
# Empacota o kit de instalação dos planetas (só o componente: os planetas são lidos da web) e publica na release fixa
# "kit-planetas" do GitHub, junto com o guia em PDF. O link de download nunca muda:
#   https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/releases/download/kit-planetas/kit-planetas.zip
# Só é preciso rodar quando o componente, o LEIA-ME ou o guia mudam. Planeta novo NÃO precisa: ele entra
# pelo catálogo publicado no site (public/planetas/catalogo.json, gerado por gerar_catalogo.mjs).
# Rodar na branch exploradores-planetas-360, depois do push.
set -euo pipefail
raiz="$(git rev-parse --show-toplevel)"
kit="$raiz/kit-planetas"
tmp="$(mktemp -d)"
mkdir -p "$tmp/components"
cp -R "$kit/components/planetas" "$tmp/components/"
cp "$kit/LEIA-ME.txt" "$tmp/"
find "$tmp" -name .DS_Store -delete
(cd "$tmp" && zip -qrX kit-planetas.zip components LEIA-ME.txt)
if ! gh release view kit-planetas >/dev/null 2>&1; then
  gh release create kit-planetas --target exploradores-planetas-360 --title "Kit de planetas 3D · Exploradores" \
    --notes "Kit dos planetas 3D para a engenharia: descompacte kit-planetas.zip na raiz do projeto Next.js e instale o three. Os planetas são lidos da web pelo id; planeta novo não exige baixar nada. Passo a passo no GUIA-ENGENHARIA.pdf."
fi
gh release upload kit-planetas "$tmp/kit-planetas.zip" "$kit/GUIA-ENGENHARIA.pdf" --clobber
echo "publicado: $(du -h "$tmp/kit-planetas.zip" | cut -f1) · $(unzip -l "$tmp/kit-planetas.zip" | tail -1)"
