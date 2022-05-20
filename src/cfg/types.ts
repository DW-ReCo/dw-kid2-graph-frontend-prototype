export type LocalStorageConfigLoader = { _type: "local_storage_loader"; key: string };
export type ServerConfigLoader = { _type: "server_loader"; endpoint: string; user: string; pass: string };

export type ConfigLoader = LocalStorageConfigLoader | ServerConfigLoader;

export type LocalDbConfig = { _type: "local_db_config"; name: string };
export type ServerDbConfig = { _type: "server_db_config"; name: string; location: string };

export type DbConfig = LocalDbConfig | ServerDbConfig;

export type PartialConfig = {
  _type: "kid2_config";
  runtime_loads?: ConfigLoader[];
  dbs?: DbConfig[];
  twitter?: { sample_api_key?: string };
};

// BuildConfig requires the runtime loads set
export type BuildConfig = PartialConfig & { runtime_loads: ConfigLoader[] };

export const emptyConfig: PartialConfig = { _type: "kid2_config" };
