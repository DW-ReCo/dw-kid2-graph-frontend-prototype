import * as types from "./types";

import { createContext, useContext } from "react";

const context = createContext<types.ConfigContext | undefined>(undefined);

export const { Provider } = context;

const useConfigContext = () => useContext(context);

export default useConfigContext;
