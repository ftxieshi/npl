import type { RouteRecord } from '@npl/shared';
export type { RouteRecord };
export interface RouterOptions { routes?: RouteRecord[]; base?: string; }
export interface RouteLocation { path: string; params: Record<string, string>; query: Record<string, string>; }
