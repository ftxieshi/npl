#!/usr/bin/env bash
set -euo pipefail

SRC="${1:-$HOME/nether-engine/crates/engine/pkg}"
DST="$(cd "$(dirname "$0")/.." && pwd)/vendor/nether-engine"

[ -d "$SRC" ] || { echo "引擎产物不存在: $SRC"; exit 1; }

mkdir -p "$DST"
cp "$SRC/nether_engine_bg.wasm" "$DST/"
cp "$SRC/nether_engine.js" "$DST/"
cp "$SRC/nether_engine.d.ts" "$DST/"
cp "$SRC/nether_engine_bg.wasm.d.ts" "$DST/"

echo "已同步引擎产物到 $DST"
