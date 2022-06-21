import { PartialConfig } from "@cfg/types";

export type ConfigContext = {
  configState: PartialConfig;
  setConfigState?: React.Dispatch<React.SetStateAction<PartialConfig>>;
};
