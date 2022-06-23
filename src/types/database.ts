import { DbConfig } from "@config/types";
import * as Rxdb from "rxdb";

import { Page } from "./page";
import { Block } from "./block";
import { Execution } from "./execution";
import { Data } from "./data";

export type Document = Page | Block | Execution | Data;

export type LoadedDb = DbConfig & { instance: Rxdb.RxDatabase };
