import type { ModuleManifest } from '@npl/shared';
const manifest: ModuleManifest = {
  id: 'download',
  entry: () => import('./index'),
  routes: [{ path: '/download', component: () => import('./index') }],
  navItem: { icon: 'download', label: '下载', order: 2 },
};
export default manifest;
