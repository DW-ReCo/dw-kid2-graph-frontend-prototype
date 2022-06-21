import * as types from "./types";

import { createContext, useContext } from "react";

const context = createContext<types.DbContext>(null);

export const { Provider } = context;

const useDbContext = () => useContext(context);

export default useDbContext;
