import React from "react";
import { RxQueryResultDoc, useRxQuery, useRxDB } from "rxdb-hooks";
import * as dbTypes from "../../db/types";
import * as cfgTypes from "../../cfg/types";
import * as queries from "../../db/queries";
import { DbsContext } from "./_context";

import * as cfg from "../../cfg";
import { omit, get } from "lodash/fp";

import * as Logger from "../../logger";

const log = Logger.makeLogger("frontent/pages/config");

const ConfigEditor = (props: { config: cfgTypes.PartialConfig }) => {
  const { config } = props;
  const { from_loader: loader } = config;

  const editableLoaders = ["local_storage_loader"]

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
  }

  return (
    <div>
      <h3>{loader && loader._type || "Build Config"} - {get('key', loader)}</h3>

      <textarea value={editableValue}
                onChange={e => setValue(e.target.value)}
                style={{width: "100%", height: "400px"}}
                disabled={!isEditable} />
      <button onClick={saveConfig}>Save</button>
      <hr />
    </div>
  )

}


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
      {configs.map(config =>
        <ConfigEditor config={config} />
      )}
    </div>
  )
};

export default ConfigsEditor;
