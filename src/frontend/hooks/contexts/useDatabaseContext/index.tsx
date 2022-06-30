import { createContext, useContext } from "react";

import * as Types from "@data-types/index";

const context = createContext<Types.Context.Database | undefined>(undefined);

export const { Provider } = context;

const useDatabaseContext = () => useContext(context);

export const getActiveDatabase = (
  dbName: string,
  dbs: Types.Database.LoadedDatabase[],
): Types.Database.LoadedDatabase => dbs.filter((db) => db.name === dbName)[0];

export default useDatabaseContext;
