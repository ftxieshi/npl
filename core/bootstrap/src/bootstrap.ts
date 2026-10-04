/// <reference types="vite/client" />
import { createRegistry } from '@npl/module-registry';
import { createNavigation } from '@npl/navigation';
import { createRouter } from '@npl/router';
import { deriveLayout } from '@npl/layout';
import type { ModuleManifest } from '@npl/shared';

export async function bootstrap() {
  const registry = createRegistry();
  const navigation = createNavigation();
  const router = createRouter();

  const manifests = import.meta.glob('../../../modules/*/src/manifest.ts', { eager: true });

  for (const mod of Object.values(manifests)) {
    const manifest = (mod as { default?: ModuleManifest }).default;
    if (manifest) registry.register(manifest);
  }

  navigation.setItems(registry.getNavItems());
  for (const route of registry.getRoutes()) router.addRoute(route);
  await registry.initAll();
  const layout = deriveLayout(registry.getNavItems());

  return { registry, navigation, router, layout };
}
