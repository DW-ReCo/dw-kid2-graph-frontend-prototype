import React, { createContext, useState } from "react";
import initialState from "./initialState";
import * as types from "./types";

export const context = createContext<types.AppStoreContext>({ state: initialState });

const AppStoreProvider = ({ children }: types.AppStoreProviderProps) => {
  const [state, setState] = useState<types.AppStore>(initialState);

  const { Provider } = context;

  return <Provider value={{ state, setState }}>{children}</Provider>;
};

export default AppStoreProvider;
