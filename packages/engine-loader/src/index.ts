import init, {
  npl_abi_version,
  npl_init,
  npl_execute,
  npl_dispose,
} from 'nether-engine';
import wasmUrl from 'nether-engine/nether_engine_bg.wasm?url';
import type { EngineConfig, EngineInstance, EngineLoader } from './types';

export type { EngineConfig, EngineInstance, EngineLoader };

export function createEngineLoader(): EngineLoader {
  let cached: EngineInstance | null = null;

  async function load(config: EngineConfig = {}): Promise<EngineInstance> {
    if (cached) return cached;

    let wasmSource: string | BufferSource = wasmUrl;

    if (config.url && config.sessionKey) {
      const response = await fetch(config.url);
      if (!response.ok) {
        throw new Error(`Engine fetch failed: ${response.status}`);
      }
      const encrypted = await response.arrayBuffer();
      const iv = encrypted.slice(0, 12);
      const ciphertext = encrypted.slice(12);
      wasmSource = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        config.sessionKey,
        ciphertext,
      );
    }

    await init({ module_or_path: wasmSource });

    cached = {
      abiVersion: () => npl_abi_version(),
      init: (cfg?: ArrayBuffer) => npl_init(0, cfg?.byteLength ?? 0),
      execute: (bytecode: ArrayBuffer) => npl_execute(0, bytecode.byteLength),
      dispose: () => {
        npl_dispose();
        cached = null;
      },
    };

    return cached;
  }

  return { load };
}
