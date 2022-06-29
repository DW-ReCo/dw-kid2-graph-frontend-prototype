import { Config, Database } from "@data-types/index";

export type Diagnostic = "INITIAL" | "OK" | "ERROR" | "LOADING" | "WARNING" | "UNKNOWN";

export type Status = {
  diagnostic: Diagnostic;
  message: string;
};

export type AppState = {
  app: {
    activeDatabase?: string;
    activePage?: string;
    showDevPanel?: boolean;
  };
};

export type App = {
  appState: AppState;
  setAppState?: React.Dispatch<React.SetStateAction<AppState>>;
};

export type Database = {
  dbState: Database.LoadedDatabase[];
  setDbState?: React.Dispatch<React.SetStateAction<Database.LoadedDatabase[]>>;
};

export type Config = {
  configState: Config.PartialConfig;
  setConfigState?: React.Dispatch<React.SetStateAction<Config.PartialConfig>>;
};
