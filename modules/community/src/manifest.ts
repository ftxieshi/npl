import type { ModuleManifest } from '@npl/shared';
const manifest: ModuleManifest = {
  id: 'community',
  entry: () => import('./index'),
  routes: [{ path: '/community', component: () => import('./index') }],
  navItem: { icon: 'community', label: '社区', order: 3 },
};
export default manifest;
