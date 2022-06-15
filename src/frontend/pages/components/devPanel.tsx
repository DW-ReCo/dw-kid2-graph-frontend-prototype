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

  const clearDbs = () => dbs.map((d) => db.clearDocs(d.db));

  const addTestingDataDbs = () => dbs.map((d) => addTestingData(d.db));

  return (
    <>
      <button onClick={clearDbs}>clear the documents (all dbs)</button>
      <button onClick={addTestingDataDbs}>add testing data (all dbs)</button>
      <>
        Databases:
        {dbs.map((d) => (
          <span>{d.name} |</span>
        ))}
      </>
    </>
  );
};

export default DevPanel;
