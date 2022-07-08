import { RxDatabase } from "rxdb";
import { Observable } from "rxjs";

import { PartialConfig } from "./config";
import * as Data from "./data-node";
import * as Record from "./execution-record";

export enum Type {
  youtuve_download_v1,
  user_added,
}

// The execution function is a closure which takes the pair of db, config,
//   and then has a function which mutates the db.  Each service determines
//   it's own arguments for this function.  the ProducedData is returned in a promise.
/* prettier-ignore */
export type ExecuteFunction<T extends Type, Args extends any[], Return extends any[]> =
  (config: PartialConfig) =>
    (...args: Args) =>
      Promise<Record.Generic<Generic<T, Args, Return>>>;

// the generic service, which takes the execution arguments.
export type Generic<T extends Type, Args extends any[], Return extends any[]> = {
  name: string;
  type: T;
  description: string;
  status: (dataNodes: Data.Data[], config: PartialConfig) => Observable<{ status: number; message: string }>;
  isAvailable: (dataNodes: Data.Data[], config: PartialConfig) => Observable<boolean>;
  execute: ExecuteFunction<T, Args, Return>;
};

// A type function to extract the args from a service:
export type ExtractArgs<S> = S extends Generic<infer T, infer X, infer Y> ? X : never;
// A type function to extract the return value from the service:
export type ExtractReturn<S> = S extends Generic<infer T, infer X, infer Y> ? Y : never;
export type ExtractType<S> = S extends Generic<infer T, infer X, infer Y> ? T : never;

export type UserAdd = Generic<Type.user_added, [Data.Data], [Data.Data]>;

export type YoutubeDownload = Generic<Type.youtuve_download_v1, [Data.YoutubeUrl], [Data.YoutubeDownloaded]>;

export type Service = UserAdd | YoutubeDownload;
