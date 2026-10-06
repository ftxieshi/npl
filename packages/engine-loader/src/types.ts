export interface EngineConfig {
  url?: string;
  sessionKey?: CryptoKey;
}

export interface EngineInstance {
  abiVersion(): number;
  init(config?: ArrayBuffer): number;
  /** 编译 `.class` 字节为 WASM 二进制模块。失败时返回空 `Uint8Array` */
  compileClass(classBytes: Uint8Array): Uint8Array;
  dispose(): void;
}

export interface EngineLoader {
  load(config?: EngineConfig): Promise<EngineInstance>;
}
