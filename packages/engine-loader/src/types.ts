export interface EngineConfig {
  /** 加密引擎的 URL。若未提供，使用打包内置的未加密版本 */
  url?: string;
  /** 会话密钥，用于解密引擎分片 */
  sessionKey?: CryptoKey;
}

export interface EngineInstance {
  /** 引擎 ABI 版本 */
  abiVersion(): number;
  /** 引擎初始化，返回 0 表示成功 */
  init(config?: ArrayBuffer): number;
  /** 执行字节码，返回 0 表示成功 */
  execute(bytecode: ArrayBuffer): number;
  /** 释放引擎资源 */
  dispose(): void;
}

export interface EngineLoader {
  load(config?: EngineConfig): Promise<EngineInstance>;
}
