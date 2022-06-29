import * as Types from "@data-types/index";

import { createContext, useContext } from "react";

const context = createContext<Types.Context.App | undefined>(undefined);

export const { Provider } = context;

const useAppContext = () => useContext(context);

export default useAppContext;
