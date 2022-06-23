import { LoadedDb } from "@data-types/index";

export type DbContext = {
  dbState: LoadedDb[];
  setDbState?: React.Dispatch<React.SetStateAction<LoadedDb[]>>;
};
