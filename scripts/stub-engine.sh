#!/usr/bin/env bash
# CI 用：生成最小 stub WASM，替代私有的下界引擎产物
set -euo pipefail

DST="$(cd "$(dirname "$0")/.." && pwd)/vendor/nether-engine"

if [ -f "$DST/nether_engine_bg.wasm" ] && [ -f "$DST/nether_engine.js" ]; then
  if grep -q "npl_abi_version" "$DST/nether_engine.js" 2>/dev/null; then
    echo "真实引擎产物已存在，跳过 stub"
    exit 0
  fi
fi

mkdir -p "$DST"

# 最小合法 WASM 模块（8 字节头）
printf '\x00\x61\x73\x6d\x01\x00\x00\x00' > "$DST/nether_engine_bg.wasm"

# 匹配真实 wasm-pack 输出的 JS 胶水层
cat > "$DST/nether_engine.js" << 'JS'
function makeExports() {
  return {
    memory: new WebAssembly.Memory({ initial: 1 }),
    npl_abi_version: () => 1,
    npl_init: () => 0,
    npl_execute: () => 0,
    npl_dispose: () => {},
  };
}

export function npl_abi_version() { return 1; }
export function npl_init() { return 0; }
export function npl_execute() { return 0; }
export function npl_dispose() {}

export function initSync() { return makeExports(); }

export default async function __wbg_init() { return makeExports(); }
JS

# 类型声明
cat > "$DST/nether_engine.d.ts" << 'TS'
export function npl_abi_version(): number;
export function npl_init(a: number, b: number): number;
export function npl_execute(a: number, b: number): number;
export function npl_dispose(): void;
export function initSync(module?: unknown): InitOutput;
export default function __wbg_init(module_or_path?: unknown): Promise<InitOutput>;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly npl_abi_version: () => number;
  readonly npl_init: (a: number, b: number) => number;
  readonly npl_execute: (a: number, b: number) => number;
  readonly npl_dispose: () => void;
}
TS

cat > "$DST/nether_engine_bg.wasm.d.ts" << 'TS'
declare const wasm: WebAssembly.Module;
export default wasm;
TS

echo "stub 引擎产物已生成到 $DST"
