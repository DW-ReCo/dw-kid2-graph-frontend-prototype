import { Data, DataYoutubeDownloaded, DataYoutubeUrl } from "./data-node";
import * as Record from "./execution-record";
import { PartialConfig } from "./config";
import { RxDatabase } from "rxdb";
import { Observable } from "rxjs";

// The execution function is a closure which takes the pair of db, config,
//   and then has a function which mutates the db.  Each service determines
//   it's own arguments for this function.  the ProducedData is returned in a promise.
/* prettier-ignore */
export type ExecuteFunction<Args extends any[], Return extends any[]> =
  (db: RxDatabase, config: PartialConfig) =>
    (...args: Args) =>
      Promise<Record.Generic<GenericService<Args, Return>>>;

// the generic service, which takes the execution arguments.
export type GenericService<Args extends any[], Return extends any[]> = {
  name: string;
  description: string;
  isAvailable: (db: RxDatabase, config: PartialConfig) => Observable<boolean>;
  execute: ExecuteFunction<Args, Return>;
};
// A type function to extract the args from a service:
export type ExtractArgs<S> = S extends GenericService<infer X, infer Y> ? X : never;
// A type function to extract the return value from the service:
export type ExtractReturn<S> = S extends GenericService<infer X, infer Y> ? Y : never;

export type UserAddService = GenericService<[Data], [Data]>;

export type YoutubeDownloadService = GenericService<[DataYoutubeUrl], [DataYoutubeDownloaded]>;

export type Service = UserAddService | YoutubeDownloadService;
