import * as Types from "./types";

import { createContext, useContext } from "react";

const context = createContext<Types.AppContext | undefined>(undefined);

export const { Provider } = context;

const useAppContext = () => useContext(context);

export default useAppContext;
