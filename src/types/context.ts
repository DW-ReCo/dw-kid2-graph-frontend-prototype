import * as Types from "@data-types/index";

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
  dbState: Types.Database.LoadedDatabase[];
  setDbState?: React.Dispatch<React.SetStateAction<Types.Database.LoadedDatabase[]>>;
};

export type Config = {
  configState: Types.Config.PartialConfig;
  setConfigState?: React.Dispatch<React.SetStateAction<Types.Config.PartialConfig>>;
};
