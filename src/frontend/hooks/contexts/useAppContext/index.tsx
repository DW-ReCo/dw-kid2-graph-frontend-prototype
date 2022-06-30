import { createContext, useContext } from "react";

import * as Types from "@data-types/index";

const context = createContext<Types.AppContext | undefined>(undefined);

export const { Provider } = context;

const useAppContext = () => useContext(context);

export default useAppContext;
