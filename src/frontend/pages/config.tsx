import * as Types from "@data-types/index";
import ConfigEditor from "@frontend/containers/config/configEditor/index";
import React, { Fragment, useState, useEffect } from "react";
import * as Config from "src/config/index";

const ConfigsEditor = () => {
  const [configs, setConfigs] = useState<Types.Config.PartialConfig[]>([]);

  // onLoad - when the application loads, load the config
  useEffect(() => {
    // only do any of this in the browser:
    if (window !== undefined) {
      Config.all().then(setConfigs);
    }
  }, []);

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
