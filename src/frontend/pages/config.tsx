import React, { Fragment } from "react";
import * as cfg from "@cfg/index";
import * as cfgTypes from "@cfg/types";
import ConfigEditor from "@frontend/containers/configEditor/index";

const ConfigsEditor = () => {
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
      {configs.map((config, index) => (
        <Fragment key={index}>
          <ConfigEditor config={config} />
        </Fragment>
      ))}
    </div>
  );
};

export default ConfigsEditor;
