
type LocalStorageConfigLoader = { _type: "local_storage_loader";
                                  key: String; }
type ServerConfigLoader = { _type: "server_loader";
                            endpoint: String;
                            user: String;
                            pass: String; }

type ConfigLoader = LocalStorageConfigLoader | ServerConfigLoader;

type LocalDbConfig = { _type: "local_db_config";
                       name: String; }
type ServerDbConfig = { _type: "server_db_config";
                        name: String;
                        location: String; }

type DbConfig = LocalDbConfig | ServerDbConfig;

export type PartialConfig = { _type: "kid2_config";
                              extends?: ConfigLoader[];
                              loads?: ConfigLoader[];
                              dbs?: DbConfig[];
                              twitter?: { sample_api_key?: String }}
