#!/usr/bin/env bash
# Empacota o kit de instalação dos planetas (só o que entra no projeto) e publica na release fixa
# "kit-planetas" do GitHub, junto com o guia em PDF. O link de download nunca muda:
#   https://github.com/nandopandp-cloud/Jornadas-Roadmap-JG-27/releases/download/kit-planetas/kit-planetas.zip
# Rodar na branch exploradores-planetas-360, depois do push.
set -euo pipefail
raiz="$(git rev-parse --show-toplevel)"
kit="$raiz/kit-planetas"
tmp="$(mktemp -d)"
mkdir -p "$tmp/components" "$tmp/public"
cp -R "$kit/components/planetas" "$tmp/components/"
cp -R "$kit/public/planetas" "$tmp/public/"
cp "$kit/LEIA-ME.txt" "$tmp/"
find "$tmp" -name .DS_Store -delete
(cd "$tmp" && zip -qrX kit-planetas.zip components public LEIA-ME.txt)
if ! gh release view kit-planetas >/dev/null 2>&1; then
  gh release create kit-planetas --target exploradores-planetas-360 --title "Kit de planetas 3D · Exploradores" \
    --notes "Download do kit para a engenharia: descompacte kit-planetas.zip na raiz do projeto Next.js e instale o three. Passo a passo no GUIA-ENGENHARIA.pdf. Os arquivos são substituídos a cada planeta novo, sempre no mesmo link."
fi
gh release upload kit-planetas "$tmp/kit-planetas.zip" "$kit/GUIA-ENGENHARIA.pdf" --clobber
echo "publicado: $(du -h "$tmp/kit-planetas.zip" | cut -f1) · $(unzip -l "$tmp/kit-planetas.zip" | tail -1)"
