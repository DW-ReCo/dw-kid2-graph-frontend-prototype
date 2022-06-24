import { LoadedDb } from "@data-types/index";
import { PartialConfig } from "@data-types/index";

export type diagnostic = "INITIAL" | "OK" | "ERROR" | "LOADING";

export type status = {
  diagnostic: diagnostic;
  message: string;
};

export type AppState = {
  app: {
    status: status;
    activeDatabase?: string;
    activePage?: string;
  };
  db: {
    status: status;
  };
  config: {
    status: status;
  };
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
