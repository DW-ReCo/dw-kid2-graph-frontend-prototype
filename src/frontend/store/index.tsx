import * as types from "./types";

import { createContext, useContext } from "react";

const context = createContext<types.AppStoreContext>(null);

export const { Provider } = context;

const useAppContext = () => useContext(context);

export default useAppContext;
