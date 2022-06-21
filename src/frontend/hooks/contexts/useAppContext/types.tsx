import { LoadedDb } from "@db/types";

export type AppState = {
  isLoading: boolean;
  activeDb?: LoadedDb;
  activePage?: string;
  dbInitialized: boolean;
  configLoaded: boolean;
};

export type AppContext = {
  appState: AppState;
  setAppState?: React.Dispatch<React.SetStateAction<AppState>>;
};
