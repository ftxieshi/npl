export interface EngineConfig { url: string; sessionKey?: CryptoKey; }
export interface EngineInstance {
  execute(bytecode: ArrayBuffer): Promise<unknown>;
  dispose(): void;
}
export interface EngineLoader { load(config: EngineConfig): Promise<EngineInstance>; }
