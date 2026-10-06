import { createSignal, onMount, For, Show } from 'solid-js';
import { bootstrap } from './bootstrap';
import { createEngineLoader } from '@npl/engine-loader';
import type { NavItem } from '@npl/shared';

export function App() {
  const [navItems, setNavItems] = createSignal<NavItem[]>([]);
  const [active, setActive] = createSignal<string | null>(null);
  const [ready, setReady] = createSignal(false);
  const [engineAbi, setEngineAbi] = createSignal<number | null>(null);
  const [engineError, setEngineError] = createSignal<string | null>(null);

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
      const abi = engine.abiVersion();
      setEngineAbi(abi);
      console.log('Nether Engine ABI:', abi);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setEngineError(msg);
      console.error('Engine load failed:', msg);
    }
  });

  return (
    <div class="h-screen flex flex-col bg-neutral-900 text-white">
      <Show when={ready()} fallback={<div class="flex-1 flex items-center justify-center">Loading…</div>}>
        <main class="flex-1 overflow-auto flex items-center justify-center">
          <Show when={engineAbi() !== null}>
            <div class="text-center space-y-2">
              <div class="text-2xl font-semibold">下界引擎已就绪</div>
              <div class="text-sm text-neutral-400">ABI 版本：{engineAbi()}</div>
            </div>
          </Show>
          <Show when={engineError() !== null}>
            <div class="text-center space-y-2">
              <div class="text-2xl font-semibold text-red-400">引擎加载失败</div>
              <div class="text-sm text-neutral-400">{engineError()}</div>
            </div>
          </Show>
          <Show when={engineAbi() === null && engineError() === null}>
            <div class="text-neutral-400">正在加载下界引擎…</div>
          </Show>
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
