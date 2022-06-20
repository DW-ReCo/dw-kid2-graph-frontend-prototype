import { AppStore } from "./types";

export default <AppStore>{
  config: {},
  dbs: [],
  appState: {
    isLoading: false,
    dbInitialized: false,
    configLoaded: false,
  },
};
