import { createContext, useContext } from "react";

import * as Types from "@data-types/index";

const context = createContext<Types.Context.Config | undefined>(undefined);

export const { Provider } = context;

const useConfigContext = () => useContext(context);

export default useConfigContext;
