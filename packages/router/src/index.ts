import type { RouteRecord } from '@npl/shared';
import type { RouterOptions, RouteLocation } from './types';
export type { RouteRecord, RouterOptions, RouteLocation };
export function createRouter(options: RouterOptions = {}) {
  const routes = new Map<string, RouteRecord>();
  let current: RouteLocation | null = null;
  function addRoute(r: RouteRecord) { routes.set(r.path, r); }
  function removeRoute(p: string) { routes.delete(p); }
  function match(p: string) { return routes.get(p) ?? null; }
  function navigate(p: string): Promise<any> {
    const r = match(p);
    if (!r) return Promise.reject(new Error(`No route: ${p}`));
    current = { path: p, params: {}, query: {} };
    return r.component();
  }
  function getCurrent() { return current; }
  return { addRoute, removeRoute, navigate, getCurrent };
}
