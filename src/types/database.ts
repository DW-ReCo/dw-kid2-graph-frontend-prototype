import * as Rxdb from "rxdb";

import { Block } from "./block";
import { DatabaseConfig } from "./config";
import { Data } from "./data-node";
import { Record } from "./execution-record";
import { Page } from "./page";

export type Document = Page | Block | Record | Data;

export type LoadedDatabase = DatabaseConfig & { instance: Rxdb.RxDatabase };
