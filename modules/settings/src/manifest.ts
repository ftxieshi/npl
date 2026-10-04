import type { ModuleManifest } from '@npl/shared';
const manifest: ModuleManifest = {
  id: 'settings',
  entry: () => import('./index'),
  routes: [{ path: '/settings', component: () => import('./index') }],
  navItem: { icon: 'settings', label: '设置', order: 5 },
};
export default manifest;
