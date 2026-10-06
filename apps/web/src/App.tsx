import { createSignal, onMount, For, Show } from 'solid-js';
import { bootstrap } from './bootstrap';
import { createEngineLoader } from '@npl/engine-loader';
import type { NavItem } from '@npl/shared';

/**
 * 内联的 `public class Test { public static int add(int a, int b) { return a + b; } }`
 * 的 `.class` 字节。用于验证完整的编译-执行链路。
 */
function buildAddClass(): Uint8Array {
  return new Uint8Array([
    0xCA, 0xFE, 0xBA, 0xBE, 0x00, 0x00, 0x00, 0x34, // magic + version
    0x00, 0x08, // cp count
    0x01, 0x00, 0x04, 0x54, 0x65, 0x73, 0x74, // #1 "Test"
    0x07, 0x00, 0x01, // #2 Class #1
    0x01, 0x00, 0x10, // #3 Utf8 len 16
    0x6A, 0x61, 0x76, 0x61, 0x2F, 0x6C, 0x61, 0x6E,
    0x67, 0x2F, 0x4F, 0x62, 0x6A, 0x65, 0x63, 0x74, // "java/lang/Object"
    0x07, 0x00, 0x03, // #4 Class #3
    0x01, 0x00, 0x03, 0x61, 0x64, 0x64, // #5 "add"
    0x01, 0x00, 0x05, 0x28, 0x49, 0x49, 0x29, 0x49, // #6 "(II)I"
    0x01, 0x00, 0x04, 0x43, 0x6F, 0x64, 0x65, // #7 "Code"
    0x00, 0x21, 0x00, 0x02, 0x00, 0x04, // access, this, super
    0x00, 0x00, // interfaces
    0x00, 0x00, // fields
    0x00, 0x01, // methods = 1
    0x00, 0x09, 0x00, 0x05, 0x00, 0x06, // public static add(II)I
    0x00, 0x01, // 1 attribute
    0x00, 0x07, 0x00, 0x00, 0x00, 0x10, // Code, length 16
    0x00, 0x02, 0x00, 0x02, // max_stack=2, max_locals=2
    0x00, 0x00, 0x00, 0x04, // code length 4
    0x1A, 0x1B, 0x60, 0xAC, // iload_0; iload_1; iadd; ireturn
    0x00, 0x00, // exception table
    0x00, 0x00, // method attributes
    0x00, 0x00, // class attributes
  ]);
}

export function App() {
  const [navItems, setNavItems] = createSignal<NavItem[]>([]);
  const [active, setActive] = createSignal<string | null>(null);
  const [ready, setReady] = createSignal(false);
  const [engineAbi, setEngineAbi] = createSignal<number | null>(null);
  const [engineError, setEngineError] = createSignal<string | null>(null);
  const [compileResult, setCompileResult] = createSignal<string | null>(null);

  onMount(async () => {
    const { registry, navigation } = await bootstrap();
    setNavItems(registry.getNavItems());
    setReady(true);
    navigation.subscribe((state) => {
      setNavItems(state.items);
      setActive(state.active);
    });

    try {
      const loader = createEngineLoader();
      const engine = await loader.load();
      setEngineAbi(engine.abiVersion());

      // 编译 .class → WASM
      const classBytes = buildAddClass();
      const wasmBytes = engine.compileClass(classBytes);

      if (wasmBytes.length === 0) {
        setCompileResult('编译失败：返回空 WASM');
        return;
      }

      // 验证 WASM 合法性
      if (!WebAssembly.validate(wasmBytes)) {
        setCompileResult('编译产出非法 WASM');
        return;
      }

      // 实例化并执行
      const module = await WebAssembly.compile(wasmBytes);
      const instance = await WebAssembly.instantiate(module, {});
      const exports = instance.exports as Record<string, unknown>;

      // 找到导出的 add 函数（名称格式：Test.add(II)I）
      const addFn = Object.entries(exports).find(([name]) => name.includes('add'))?.[1];
      if (typeof addFn !== 'function') {
        setCompileResult(`未找到 add 函数，导出：${Object.keys(exports).join(', ')}`);
        return;
      }

      const result = (addFn as (a: number, b: number) => number)(2, 3);
      setCompileResult(`add(2, 3) = ${result}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setEngineError(msg);
    }
  });

  return (
    <div class="h-screen flex flex-col bg-neutral-900 text-white">
      <Show when={ready()} fallback={<div class="flex-1 flex items-center justify-center">Loading…</div>}>
        <main class="flex-1 overflow-auto flex items-center justify-center">
          <div class="text-center space-y-3">
            <Show when={engineAbi() !== null}>
              <div class="text-2xl font-semibold">下界引擎已就绪</div>
              <div class="text-sm text-neutral-400">ABI 版本：{engineAbi()}</div>
            </Show>
            <Show when={compileResult() !== null}>
              <div class="text-lg text-green-400 font-mono">{compileResult()}</div>
            </Show>
            <Show when={engineError() !== null}>
              <div class="text-lg text-red-400">引擎加载失败：{engineError()}</div>
            </Show>
          </div>
        </main>
        <Show when={navItems().length > 0}>
          <nav class="flex justify-center gap-4 p-4 border-t border-neutral-700">
            <For each={navItems()}>
              {(item) => (
                <button
                  class={`px-4 py-2 rounded-full transition ${active() === item.label ? 'bg-neutral-700' : 'hover:bg-neutral-800'}`}
                  onClick={() => setActive(item.label)}
                >
                  {item.label}
                </button>
              )}
            </For>
          </nav>
        </Show>
      </Show>
    </div>
  );
}
