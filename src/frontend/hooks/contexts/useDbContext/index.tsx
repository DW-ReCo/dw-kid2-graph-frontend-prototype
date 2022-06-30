import { createContext, useContext } from "react";

import * as Types from "@data-types/index";
import { LoadedDb } from "@data-types/index";

const context = createContext<Types.DbContext | undefined>(undefined);

export const { Provider } = context;

const useDbContext = () => useContext(context);

export const getactiveDatabase = (dbName: string, dbs: LoadedDb[]): LoadedDb =>
  dbs.filter((db) => db.name === dbName)[0];

export default useDbContext;
