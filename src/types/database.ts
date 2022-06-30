import * as Rxdb from "rxdb";

import { Block } from "./block";
import { DbConfig } from "./config";
import { Data } from "./data";
import { Execution } from "./execution";
import { Page } from "./page";

export type Document = Page | Block | Execution | Data;

export type LoadedDb = DbConfig & { instance: Rxdb.RxDatabase };
