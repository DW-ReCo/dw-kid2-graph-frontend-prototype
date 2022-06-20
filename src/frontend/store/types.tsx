import { PartialConfig } from "@cfg/types";
import { LoadedDb } from "@db/types";

export type AppStore = {
  dbs: LoadedDb[];
  config: PartialConfig;
  appState: {
    isLoading: boolean;
    activeDb?: LoadedDb;
    activePage?: string;
  };
};

export interface AppStoreProviderProps {
  children: React.ReactNode;
}

export type AppStoreContext = {
  state: AppStore;
  setState?: React.Dispatch<React.SetStateAction<AppStore>>;
};
