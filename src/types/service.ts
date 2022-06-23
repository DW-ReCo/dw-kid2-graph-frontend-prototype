import { Data } from "./data";
import { Execution } from "./execution";
import * as Config from "./config";
import { RxDatabase } from "rxdb";
import { Observable } from "rxjs";

// the service should be able to signal when it is available and when not,
// based on the database and config that is passed to it.
type IsAvailable = (db: RxDatabase, cfg: Config.PartialConfig) => Observable<boolean>;

// The service, when executed, will always return in the following form:
//   note:  the execution also mutates the db which is passed to it!!!
//          these returned values are more of a record
type ProducedData<Return> = {
  record: Execution;
  created: Return;
};

// The execution function is a closure which takes the pair of db, config,
//   and then has a function which mutates the db.  Each service determines
//   it's own arguments for this function.  the ProducedData is returned in a promise.
/* prettier-ignore */
export type ExecuteFunction<Args extends any[], Return> =
  (db: RxDatabase, cfg: Config.PartialConfig) =>
    (...args: Args) => Promise<ProducedData<Return>>;

// the generic service, which takes the execution arguments.
export type GenericService<Args extends any[], Return extends any[]> = {
  isAvailable: IsAvailable;
  execute: ExecuteFunction<Args, Return>;
};
// A type function to extract the args from a service:
export type ExtractArgs<S> = S extends GenericService<infer X, infer Y> ? X : never;
// A type function to extract the return value from the service:
export type ExtractReturn<S> = S extends GenericService<infer X, infer Y> ? Y : never;

export type UserAddService = GenericService<[Data], [Data]>;

export type YoutubeDlService = GenericService<[Data], [Data]>;
