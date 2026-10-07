import { createSignal, onMount, For, Show } from 'solid-js';
import { bootstrap } from './bootstrap';
import { createEngineLoader } from '@npl/engine-loader';
import type { NavItem } from '@npl/shared';

function buildAddClass(): Uint8Array {
  return new Uint8Array([
    0xCA, 0xFE, 0xBA, 0xBE, 0x00, 0x00, 0x00, 0x34,
    0x00, 0x08,
    0x01, 0x00, 0x04, 0x54, 0x65, 0x73, 0x74,
    0x07, 0x00, 0x01,
    0x01, 0x00, 0x10,
    0x6A, 0x61, 0x76, 0x61, 0x2F, 0x6C, 0x61, 0x6E,
    0x67, 0x2F, 0x4F, 0x62, 0x6A, 0x65, 0x63, 0x74,
    0x07, 0x00, 0x03,
    0x01, 0x00, 0x03, 0x61, 0x64, 0x64,
    0x01, 0x00, 0x05, 0x28, 0x49, 0x49, 0x29, 0x49,
    0x01, 0x00, 0x04, 0x43, 0x6F, 0x64, 0x65,
    0x00, 0x21, 0x00, 0x02, 0x00, 0x04,
    0x00, 0x00,
    0x00, 0x00,
    0x00, 0x01,
    0x00, 0x09, 0x00, 0x05, 0x00, 0x06,
    0x00, 0x01,
    0x00, 0x07, 0x00, 0x00, 0x00, 0x10,
    0x00, 0x02, 0x00, 0x02,
    0x00, 0x00, 0x00, 0x04,
    0x1A, 0x1B, 0x60, 0xAC,
    0x00, 0x00,
    0x00, 0x00,
    0x00, 0x00,
  ]);
}

/**
 * `public static int max(int a, int b) { return a < b ? b : a; }`
 *
 * 字节码：
 *   0: iload_0
 *   1: iload_1
 *   2: if_icmplt 7
 *   5: iload_0
 *   6: ireturn
 *   7: iload_1
 *   8: ireturn
 */
function buildMaxClass(): Uint8Array {
  return new Uint8Array([
    // magic + version
    0xCA, 0xFE, 0xBA, 0xBE, 0x00, 0x00, 0x00, 0x34,
    // cp count = 8
    0x00, 0x08,
    // #1 "Test"
    0x01, 0x00, 0x04, 0x54, 0x65, 0x73, 0x74,
    // #2 Class #1
    0x07, 0x00, 0x01,
    // #3 "java/lang/Object"
    0x01, 0x00, 0x10,
    0x6A, 0x61, 0x76, 0x61, 0x2F, 0x6C, 0x61, 0x6E,
    0x67, 0x2F, 0x4F, 0x62, 0x6A, 0x65, 0x63, 0x74,
    // #4 Class #3
    0x07, 0x00, 0x03,
    // #5 "max"
    0x01, 0x00, 0x03, 0x6D, 0x61, 0x78,
    // #6 "(II)I"
    0x01, 0x00, 0x05, 0x28, 0x49, 0x49, 0x29, 0x49,
    // #7 "Code"
    0x01, 0x00, 0x04, 0x43, 0x6F, 0x64, 0x65,
    // access, this, super
    0x00, 0x21, 0x00, 0x02, 0x00, 0x04,
    // interfaces
    0x00, 0x00,
    // fields
    0x00, 0x00,
    // methods = 1
    0x00, 0x01,
    // method: public static max(II)I
    0x00, 0x09, 0x00, 0x05, 0x00, 0x06,
    // attrs = 1
    0x00, 0x01,
    // Code, length 21 (0x15)
    0x00, 0x07, 0x00, 0x00, 0x00, 0x15,
    // max_stack = 2
    0x00, 0x02,
    // max_locals = 2
    0x00, 0x02,
    // code_length = 9
    0x00, 0x00, 0x00, 0x09,
    // iload_0; iload_1; if_icmplt +5; iload_0; ireturn; iload_1; ireturn
    0x1A, 0x1B, 0xA1, 0x00, 0x05, 0x1A, 0xAC, 0x1B, 0xAC,
    // exception_table_length = 0
    0x00, 0x00,
    // attributes_count = 0
    0x00, 0x00,
    // class attributes = 0
    0x00, 0x00,
  ]);
}

function buildSumClass(): Uint8Array {
  return new Uint8Array([
    0xCA, 0xFE, 0xBA, 0xBE, 0x00, 0x00, 0x00, 0x34,
    0x00, 0x08,
    0x01, 0x00, 0x04, 0x54, 0x65, 0x73, 0x74,
    0x07, 0x00, 0x01,
    0x01, 0x00, 0x10,
    0x6A, 0x61, 0x76, 0x61, 0x2F, 0x6C, 0x61, 0x6E,
    0x67, 0x2F, 0x4F, 0x62, 0x6A, 0x65, 0x63, 0x74,
    0x07, 0x00, 0x03,
    0x01, 0x00, 0x03, 0x73, 0x75, 0x6D,
    0x01, 0x00, 0x04, 0x28, 0x49, 0x29, 0x49,
    0x01, 0x00, 0x04, 0x43, 0x6F, 0x64, 0x65,
    0x00, 0x21, 0x00, 0x02, 0x00, 0x04,
    0x00, 0x00,
    0x00, 0x00,
    0x00, 0x01,
    0x00, 0x09, 0x00, 0x05, 0x00, 0x06,
    0x00, 0x01,
    0x00, 0x07, 0x00, 0x00, 0x00, 0x21,
    0x00, 0x02,
    0x00, 0x03,
    0x00, 0x00, 0x00, 0x15,
    0x03,
    0x3C,
    0x03,
    0x3D,
    0x1C,
    0x1A,
    0xA3,
    0x00,
    0x0D,
    0x1B,
    0x1C,
    0x60,
    0x3C,
    0x84,
    0x02,
    0x01,
    0xA7,
    0xFF,
    0xF4,
    0x1B,
    0xAC,
    0x00, 0x00,
    0x00, 0x00,
    0x00, 0x00,
  ]);
}

interface RunResult {
  name: string;
  result: string;
}

export function App() {
  const [navItems, setNavItems] = createSignal<NavItem[]>([]);
  const [active, setActive] = createSignal<string | null>(null);
  const [ready, setReady] = createSignal(false);
  const [engineAbi, setEngineAbi] = createSignal<number | null>(null);
  const [engineError, setEngineError] = createSignal<string | null>(null);
  const [results, setResults] = createSignal<RunResult[]>([]);

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

      // 1. add(2, 3)
      const addWasm = engine.compileClass(buildAddClass());
      if (addWasm.length > 0 && WebAssembly.validate(addWasm)) {
        const mod = await WebAssembly.compile(addWasm);
        const inst = await WebAssembly.instantiate(mod, {});
        const exports = inst.exports as Record<string, unknown>;
        const addFn = Object.entries(exports).find(([n]) => n.includes('add'))?.[1];
        if (typeof addFn === 'function') {
          const r = (addFn as (a: number, b: number) => number)(2, 3);
          setResults((prev) => [...prev, { name: 'add(2, 3)', result: String(r) }]);
        }
      }

      // 2. max(7, 3) 和 max(2, 9)
      const maxWasm = engine.compileClass(buildMaxClass());
      console.log('maxWasm.length =', maxWasm.length);
      const maxValid = maxWasm.length > 0 && WebAssembly.validate(maxWasm);
      console.log('maxWasm valid =', maxValid);
      if (maxValid) {
        const mod = await WebAssembly.compile(maxWasm);
        const inst = await WebAssembly.instantiate(mod, {});
        const exports = inst.exports as Record<string, unknown>;
        console.log('maxWasm exports =', Object.keys(exports));
        const maxFn = Object.entries(exports).find(([n]) => n.includes('max'))?.[1];
        console.log('maxFn type =', typeof maxFn);
        if (typeof maxFn === 'function') {
          const f = maxFn as (a: number, b: number) => number;
          setResults((prev) => [...prev, { name: 'max(7, 3)', result: String(f(7, 3)) }]);
          setResults((prev) => [...prev, { name: 'max(2, 9)', result: String(f(2, 9)) }]);
        }
      } else {
        console.error('maxWasm first 16 bytes:', Array.from(maxWasm.slice(0, 16)));
      }

      // 3. sum(10) 和 sum(100)
      const sumWasm = engine.compileClass(buildSumClass());
      if (sumWasm.length > 0 && WebAssembly.validate(sumWasm)) {
        const mod = await WebAssembly.compile(sumWasm);
        const inst = await WebAssembly.instantiate(mod, {});
        const exports = inst.exports as Record<string, unknown>;
        const sumFn = Object.entries(exports).find(([n]) => n.includes('sum'))?.[1];
        if (typeof sumFn === 'function') {
          const f = sumFn as (n: number) => number;
          setResults((prev) => [...prev, { name: 'sum(10)', result: String(f(10)) }]);
          setResults((prev) => [...prev, { name: 'sum(100)', result: String(f(100)) }]);
        }
      } else {
        console.error('sumWasm invalid, length =', sumWasm.length);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setEngineError(msg);
    }
  });

  return (
    <div class="h-screen flex flex-col bg-neutral-900 text-white">
      <Show when={ready()} fallback={<div class="flex-1 flex items-center justify-center">Loading…</div>}>
        <main class="flex-1 overflow-auto flex items-center justify-center">
          <div class="text-center space-y-4">
            <Show when={engineAbi() !== null}>
              <div class="text-2xl font-semibold">下界引擎已就绪</div>
              <div class="text-sm text-neutral-400">ABI 版本：{engineAbi()}</div>
            </Show>
            <Show when={results().length > 0}>
              <div class="space-y-2 mt-4">
                <For each={results()}>
                  {(r) => (
                    <div class="text-lg text-green-400 font-mono">
                      {r.name} = {r.result}
                    </div>
                  )}
                </For>
              </div>
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
