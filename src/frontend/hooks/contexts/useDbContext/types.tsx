import { LoadedDb } from "@db/types";

export type DbContext = {
  dbState: LoadedDb[];
  setDbState?: React.Dispatch<React.SetStateAction<LoadedDb[]>>;
};
