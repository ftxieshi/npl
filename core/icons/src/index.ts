/// <reference types="vite/client" />
const cache = new Map<string, Promise<string>>();
export interface IconRegistry {
  load(name: string): Promise<string>;
  clear(name?: string): void;
}
export function createIconRegistry(loadFn: (name: string) => Promise<string>): IconRegistry {
  function load(name: string): Promise<string> {
    if (!cache.has(name)) {
      cache.set(name, loadFn(name).catch((err) => { cache.delete(name); throw err; }));
    }
    return cache.get(name)!;
  }
  function clear(name?: string) {
    if (name) cache.delete(name);
    else cache.clear();
  }
  return { load, clear };
}
export function createDefaultLoader() {
  const modules = import.meta.glob('./assets/*.svg', { query: '?raw', import: 'default' });
  return async (name: string): Promise<string> => {
    const key = `./assets/${name}.svg`;
    const loader = modules[key];
    if (!loader) throw new Error(`Icon not found: ${name}`);
    return (await loader()) as string;
  };
}
