import { PartialConfig } from "@data-types/index";

export type ConfigContext = {
  configState: PartialConfig;
  setConfigState?: React.Dispatch<React.SetStateAction<PartialConfig>>;
};
