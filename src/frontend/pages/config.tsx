import React from "react";
import * as cfgTypes from "@cfg/types";
import { DbsContext } from "./_context";
import * as cfg from "@cfg/index";
import ConfigEditor from "@frontend/containers/configEditor/index";

const ConfigsEditor = () => {
  const dbs = React.useContext(DbsContext);
  const [configs, setConfigs] = React.useState<cfgTypes.PartialConfig[]>([]);

  // onLoad - when the application loads, load the config
  React.useEffect(() => {
    // only do any of this in the browser:
    if (window !== undefined) {
      cfg.all().then(setConfigs);
    }
  }, []);

  console.log(configs);

  return (
    <div>
      <h1>Edit Config</h1>
      {configs.map((config) => (
        <ConfigEditor config={config} />
      ))}
    </div>
  );
};

export default ConfigsEditor;
