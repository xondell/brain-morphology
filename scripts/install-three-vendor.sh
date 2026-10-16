#!/usr/bin/env bash
# Download official Three.js runtime from npm, pin version and verify basic files.
set -euo pipefail
cd "$(dirname "$0")/.."
command -v npm >/dev/null || { echo 'Для Three.js нужен npm (Node.js).'; exit 1; }
root="$PWD"
mkdir -p vendor/three/build vendor/three/examples/jsm/loaders vendor/three/examples/jsm/utils
tmp=$(mktemp -d);trap 'rm -rf "$tmp"' EXIT
(cd "$tmp" && npm pack three@0.181.0 --silent >/dev/null)
archive=$(find "$tmp" -name 'three-0.181.0.tgz' -print -quit)
[[ -n "$archive" ]] || { echo 'npm pack не вернул three'; exit 1; }
tar -xzf "$archive" -C "$tmp" package/LICENSE package/build/three.module.js package/build/three.core.js package/examples/jsm/loaders/GLTFLoader.js package/examples/jsm/utils/BufferGeometryUtils.js
cp "$tmp/package/LICENSE" "$root/vendor/three/LICENSE"
cp "$tmp/package/build/"{three.module.js,three.core.js} "$root/vendor/three/build/"
cp "$tmp/package/examples/jsm/loaders/GLTFLoader.js" "$root/vendor/three/examples/jsm/loaders/"
cp "$tmp/package/examples/jsm/utils/BufferGeometryUtils.js" "$root/vendor/three/examples/jsm/utils/"
echo 'Three.js 0.181.0 готов (локальные ES-модули, без CDN).'
