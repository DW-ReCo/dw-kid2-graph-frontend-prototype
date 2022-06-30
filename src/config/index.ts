import { mergeAll } from "lodash/fp";

import * as Types from "@data-types/index";

import { config as buildConfig } from "../../build.cfg";

/*
 *  The config delivering module,
 *    contains the code which loads and fetches config.
 *
 *    config loads and extends loaded config file in `extends`,
 *      and gets overridden by configs loaded in `loads`
 *
 *    TODO: think about if this should load recursively or not, or just one level deep
 *
 */

const fromLocalStorage: (l: Types.LocalStorageConfigLoader) => Promise<Types.PartialConfig> = ({ key }) => {
  const storedConfigStr: string | null = window.localStorage.getItem(key);
  if (!storedConfigStr) {
    console.warn(`[cfg] no local config found at ${key}`);
    return Promise.resolve(Types.emptyConfig);
  }
  const storedConfig: Types.PartialConfig = JSON.parse(storedConfigStr);
  return Promise.resolve(storedConfig);
};

export const toLocalStorage = (l: Types.LocalStorageConfigLoader, c: Types.PartialConfig) => {
  const { key } = l;
  typeof window !== "undefined" ? window.localStorage.setItem(key, JSON.stringify(c)) : false;
};

const fromServer: (l: Types.ServerConfigLoader) => Promise<Types.PartialConfig> =
  // in the future, this will fetch config from a server.  for now, it returns nothing
  () => Promise.resolve(Types.emptyConfig);

const fromLoader: (l: Types.ConfigLoader) => Promise<Types.PartialConfig> = async (l) => {
  switch (l._type) {
    case "local_storage_loader":
      return fromLocalStorage(l);
    case "server_loader":
      return fromServer(l);
  }
};

// The loading function, takes all the configs defined in the build and loads them.
// in the future, this function could work recursively, i.e the user has
// configured places to load more config from
export const all: () => Promise<Types.PartialConfig[]> = async () => {
  const { runtime_loads } = buildConfig;

  const getLoader = (loader: Types.ConfigLoader) =>
    fromLoader(loader).then((config) => ({ ...config, from_loader: loader }));

  // turn the runtime loads into PartialConfigs
  const configs = await Promise.all(runtime_loads.map(getLoader));

  return [buildConfig, ...configs];
};

export const load: () => Promise<Types.PartialConfig> = async () => {
  // TODO: deep merge
  return all().then(mergeAll);
};
