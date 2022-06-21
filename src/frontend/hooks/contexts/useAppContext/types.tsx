export type AppState = {
  isLoading: boolean;
  activeDb?: string;
  activePage?: string;
  dbInitialized: boolean;
  configLoaded: boolean;
};

export type AppContext = {
  appState: AppState;
  setAppState?: React.Dispatch<React.SetStateAction<AppState>>;
};
