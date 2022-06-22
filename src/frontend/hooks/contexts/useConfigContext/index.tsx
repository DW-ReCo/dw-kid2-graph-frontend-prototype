import * as Types from "./types";

import { createContext, useContext } from "react";

const context = createContext<Types.ConfigContext | undefined>(undefined);

export const { Provider } = context;

const useConfigContext = () => useContext(context);

export default useConfigContext;
