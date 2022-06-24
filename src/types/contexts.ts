import { LoadedDb } from "@data-types/index";
import { PartialConfig } from "@data-types/index";

type diagnostic = "INITIAL" | "OK" | "ERROR" | "LOADING";

export type AppState = {
  app: {
    status: {
      diagnostic: diagnostic;
      message: string;
    };
    activeDatabase?: string;
    activePage?: string;
  };
  db: {
    status: {
      diagnostic: diagnostic;
      message: string;
    };
  };
  config: {
    status: {
      diagnostic: diagnostic;
      message: string;
    };
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
