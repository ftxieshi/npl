import type { ModuleManifest } from '@npl/shared';
const manifest: ModuleManifest = {
  id: 'home',
  entry: () => import('./index'),
  routes: [{ path: '/', component: () => import('./index') }],
  navItem: { icon: 'home', label: '首页', order: 1 },
};
export default manifest;
