import { DbConfig } from "./config";
import * as Rxdb from "rxdb";

import { Page } from "./page";
import { Block } from "./block";
import { Execution } from "./execution-record";
import { Data } from "./data-node";

export type Document = Page | Block | Execution | Data;

export type LoadedDb = DbConfig & { instance: Rxdb.RxDatabase };
