import * as types from "./types";

import { createContext, useContext } from "react";
import { LoadedDb } from "@db/types";

const context = createContext<types.DbContext | undefined>(undefined);

export const { Provider } = context;

const useDbContext = () => useContext(context);

export const getActiveDb = (dbName: string, dbs: LoadedDb[]): LoadedDb => dbs.filter((db) => db.name === dbName)[0];

export default useDbContext;
