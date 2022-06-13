import React from "react";
import { RxCollection, RxDatabase } from "rxdb";
import { useRxDB } from "rxdb-hooks";
import * as db from "../../../db";
import * as dbTypes from "../../../db/types";

import { addTestingData } from "../../../db/testing_data";

import { DbsContext } from "../_context";
import { first } from "lodash/fp";

const DevPanel = () => {
  const dbs = React.useContext(DbsContext);

  const firstDb = first(dbs);

  if (!firstDb) return <>No Db</>;

  const clearDb = () => db.clearDocs(firstDb.db);
  const addTestingDataDb = () => addTestingData(firstDb.db);

  return (
    <>
      <button onClick={clearDb}>clear the documents</button>
      <button onClick={addTestingDataDb}>add testing data</button>
      <>
        Databases:
        {dbs.map(d =>
          <span>{d.name} |</span>
        )}
        </>
    </>
  );
};

export default DevPanel;
