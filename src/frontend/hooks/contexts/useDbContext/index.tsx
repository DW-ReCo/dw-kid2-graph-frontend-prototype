import * as Types from "@data-types/index";

import { createContext, useContext } from "react";

const context = createContext<Types.Context.Database | undefined>(undefined);

export const { Provider } = context;

const useDbContext = () => useContext(context);

export const getActiveDatabase = (
  dbName: string,
  dbs: Types.Database.LoadedDatabase[],
): Types.Database.LoadedDatabase => dbs.filter((db) => db.name === dbName)[0];

export default useDbContext;
