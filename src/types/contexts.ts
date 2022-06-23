import { LoadedDb } from "@data-types/index";
import { PartialConfig } from "@data-types/index";

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

export type DbContext = {
  dbState: LoadedDb[];
  setDbState?: React.Dispatch<React.SetStateAction<LoadedDb[]>>;
};

export type ConfigContext = {
  configState: PartialConfig;
  setConfigState?: React.Dispatch<React.SetStateAction<PartialConfig>>;
};
