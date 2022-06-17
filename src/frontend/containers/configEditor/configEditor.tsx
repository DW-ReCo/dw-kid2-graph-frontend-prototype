import React from "react";
import * as cfgTypes from "@cfg/types";
import { omit, get } from "lodash/fp";
import * as Logger from "@logger/index";
import * as cfg from "@cfg/index";
import JSONEditor from "react-json-editor-ajrm";

const log = Logger.makeLogger("frontent/pages/config");

const ConfigEditor = (props: { config: cfgTypes.PartialConfig }) => {
  const { config } = props;
  const { from_loader: loader } = config;

  const editableLoaders = ["local_storage_loader"];
  const isEditable = loader && editableLoaders.includes(loader._type);
  const editableConfig = omit(["from_loader"], config);
  const [editableValue, setValue] = React.useState<string>(JSON.stringify(editableConfig));

  const saveConfig = () => {
    const c = editableValue;
    log.debug(`saving config`, c);
    try {
      const cc = JSON.parse(c);
      // TODO verify valid config
      // TODO remove AS
      cfg.toLocalStorage(loader as cfgTypes.LocalStorageConfigLoader, cc);
      // TODO then reload app config!!!!
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
      <JSONEditor
        placeholder={editableConfig}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          isEditable && setValue(JSON.stringify(e.target.value))
        }
        viewOnly={!isEditable}
        height="100%"
      />
      <button onClick={saveConfig}>Save</button>
      <hr />
    </div>
  );
};

export default ConfigEditor;
