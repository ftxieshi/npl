import type { EngineConfig, EngineInstance, EngineLoader } from './types';
export type { EngineConfig, EngineInstance, EngineLoader };
export function createEngineLoader(): EngineLoader {
  async function load(config: EngineConfig): Promise<EngineInstance> {
    const response = await fetch(config.url);
    if (!response.ok) throw new Error(`Engine fetch failed: ${response.status}`);
    if (config.sessionKey) {
      const encrypted = await response.arrayBuffer();
      const iv = encrypted.slice(0, 12);
      const ciphertext = encrypted.slice(12);
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, config.sessionKey, ciphertext);
      const mod = await WebAssembly.compile(decrypted);
      return wrap(mod);
    }
    const inst = await WebAssembly.instantiateStreaming(response, {});
    return wrap(inst.module, inst.instance);
  }
  function wrap(mod: WebAssembly.Module, inst?: WebAssembly.Instance): EngineInstance {
    return {
      async execute(bytecode: ArrayBuffer) {
        if (!inst) inst = await WebAssembly.instantiate(mod, {});
        const ex = inst.exports as Record<string, unknown>;
        const exec = ex.npl_execute as (p: number, l: number) => number;
        if (!exec) throw new Error('npl_execute not exported');
        const bytes = new Uint8Array(bytecode);
        const mem = ex.memory as WebAssembly.Memory;
        new Uint8Array(mem.buffer).set(bytes, 0);
        return exec(0, bytes.length);
      },
      dispose() { inst = undefined; },
    };
  }
  return { load };
}
