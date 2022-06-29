import { DatabaseConfig } from "./config";
import * as Rxdb from "rxdb";

import { Page } from "./page";
import { Block } from "./block";
import { Record } from "./execution-record";
import { Data } from "./data-node";

export type Document = Page | Block | Record | Data;

export type LoadedDb = DatabaseConfig & { instance: Rxdb.RxDatabase };
