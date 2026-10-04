import type { ModuleManifest, NavItem, RouteRecord } from '@npl/shared';
export interface ModuleRegistry {
  register(manifest: ModuleManifest): void;
  get(id: string): ModuleManifest | undefined;
  getAll(): ModuleManifest[];
  getNavItems(): NavItem[];
  getRoutes(): RouteRecord[];
  initAll(): Promise<void>;
}
export function createRegistry(): ModuleRegistry {
  const modules = new Map<string, ModuleManifest>();
  function register(m: ModuleManifest) {
    if (modules.has(m.id)) throw new Error(`Module already registered: ${m.id}`);
    modules.set(m.id, m);
  }
  function get(id: string) { return modules.get(id); }
  function getAll() { return Array.from(modules.values()); }
  function getNavItems() {
    return getAll().filter((m) => m.navItem).map((m) => m.navItem!).sort((a, b) => a.order - b.order);
  }
  function getRoutes() { return getAll().flatMap((m) => m.routes ?? []); }
  async function initAll() { for (const m of getAll()) if (m.init) await m.init(); }
  return { register, get, getAll, getNavItems, getRoutes, initAll };
}
