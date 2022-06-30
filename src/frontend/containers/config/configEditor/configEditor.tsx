import { get, omit } from "lodash/fp";
import * as Config from "src/config/index";

import React, { useState } from "react";

import * as Types from "@data-types/index";

import useConfigContext from "@frontend/hooks/contexts/useConfigContext";

import * as Logger from "@logger/index";

const log = Logger.makeLogger("frontent/pages/config");

const ConfigEditor = (props: { config: Types.Config.PartialConfig }) => {
  const { config } = props;
  const { from_loader: loader } = config;
  // @ts-ignore FIXME
  const { setConfigState } = useConfigContext();

  const editableLoaders = ["local_storage_loader"];
  const isEditable = loader && editableLoaders.includes(loader._type);
  const editableConfig = omit(["from_loader"], config);
  const [editableValue, setValue] = useState<string>(JSON.stringify(editableConfig, null, 2));

  const saveConfig = () => {
    const c = editableValue;
    log.debug(`saving config`, c);
    try {
      const cc = JSON.parse(c);
      // TODO verify valid config
      // TODO remove AS
      Config.toLocalStorage(loader as Types.Config.LocalStorageConfigLoader, cc);
      Config.load().then((c) => setConfigState(c));
      console.log(cc);
    } catch (e) {
      alert(`something went wrong ${e}`);
    }
  };

  return (
    <div>
      <h3>
        {(loader && loader._type) || "Build Config"} - {get("key", loader)}
      </h3>
      <textarea
        rows={20}
        cols={200}
        onChange={(e) => isEditable && setValue(e.target.value)}
        className="font-mono"
        disabled={!isEditable}
      >
        {editableValue}
      </textarea>
      {isEditable && <button onClick={saveConfig}>Save</button>}
      <hr />
    </div>
  );
};

export default ConfigEditor;
