#!/usr/bin/env bash
# BodyParts3D source attribution and share-alike licence are in docs/ASSET_CREDITS.md.
set -euo pipefail
cd "$(dirname "$0")/.."
url='https://raw.githubusercontent.com/Rickaym/brain-game/e4c2e6dc0df6976b33426f17c164c2c50c711587/public/models/brain.glb'
expected='9462f6f86cf231561169d98187fe0cc455137909'
mkdir -p assets
if [[ -f assets/brain.glb ]] && [[ $(git hash-object assets/brain.glb) == "$expected" ]]; then
  echo 'Анатомическая модель уже установлена.'; exit 0
fi
command -v git >/dev/null || { echo 'Нужен git для проверки целостности.' >&2; exit 1; }
command -v curl >/dev/null || { echo 'Нужен curl для загрузки модели.' >&2; exit 1; }
tmp=$(mktemp assets/brain.glb.XXXXXX)
trap 'rm -f "$tmp"' EXIT
curl --fail --location --retry 3 --connect-timeout 15 --max-time 180 "$url" --output "$tmp"
actual=$(git hash-object "$tmp")
if [[ "$actual" != "$expected" ]]; then
  echo "Контрольная сумма не совпадает. Получено: $actual" >&2
  exit 1
fi
mv "$tmp" assets/brain.glb
trap - EXIT
echo 'Модель готова: assets/brain.glb (2,8 МБ, SHA подтверждён).'
