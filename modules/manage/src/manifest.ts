import type { ModuleManifest } from '@npl/shared';
const manifest: ModuleManifest = {
  id: 'manage',
  entry: () => import('./index'),
  routes: [{ path: '/manage', component: () => import('./index') }],
  navItem: { icon: 'manage', label: '管理', order: 4 },
};
export default manifest;
