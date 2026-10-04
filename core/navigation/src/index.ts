import type { NavItem } from '@npl/shared';
export interface NavigationState { items: NavItem[]; active: string | null; }
export function createNavigation(initial?: NavItem[]) {
  let items: NavItem[] = initial ?? [];
  let active: string | null = null;
  const listeners = new Set<(s: NavigationState) => void>();
  function notify() {
    const s = { items, active };
    listeners.forEach((fn) => fn(s));
  }
  function setItems(next: NavItem[]) { items = [...next].sort((a, b) => a.order - b.order); notify(); }
  function setActive(l: string | null) { active = l; notify(); }
  function subscribe(fn: (s: NavigationState) => void) {
    listeners.add(fn);
    fn({ items, active });
    return () => listeners.delete(fn);
  }
  return { setItems, setActive, subscribe };
}
