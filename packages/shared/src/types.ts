export interface RouteRecord {
  path: string;
  component: () => Promise<any>;
  children?: RouteRecord[];
  meta?: Record<string, unknown>;
}
export interface NavItem { icon: string; label: string; order: number; }
export interface ModuleManifest {
  id: string;
  entry: () => Promise<any>;
  routes?: RouteRecord[];
  navItem?: NavItem;
  resources?: string[];
  init?: () => void | Promise<void>;
}
