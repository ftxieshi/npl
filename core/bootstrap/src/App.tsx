import { createSignal, onMount, For, Show } from 'solid-js';
import { bootstrap } from './bootstrap';
import type { NavItem } from '@npl/shared';

export function App() {
  const [navItems, setNavItems] = createSignal<NavItem[]>([]);
  const [active, setActive] = createSignal<string | null>(null);
  const [ready, setReady] = createSignal(false);

  onMount(async () => {
    const { registry, navigation } = await bootstrap();
    setNavItems(registry.getNavItems());
    setReady(true);
    navigation.subscribe((state) => {
      setNavItems(state.items);
      setActive(state.active);
    });
  });

  return (
    <div class="h-screen flex flex-col bg-neutral-900 text-white">
      <Show when={ready()} fallback={<div class="flex-1 flex items-center justify-center">Loading…</div>}>
        <main class="flex-1 overflow-auto" />
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
