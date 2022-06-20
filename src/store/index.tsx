import React, { createContext, useState } from "react";
import initialState from "./initialState";
import * as types from "./types";

const { Provider } = createContext(initialState);

const AppStoreProvider = ({ children }: types.AppStoreProviderProps): React.ReactNode => {
  const [state, setState] = useState<types.AppStore>(initialState);

  return <Provider value={{ state, setState }}>{children}</Provider>;
};

export default AppStoreProvider;
