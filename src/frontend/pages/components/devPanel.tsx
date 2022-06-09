import React from "react";
import { RxCollection, RxDatabase } from "rxdb";
import { useRxDB } from "rxdb-hooks";
import * as db from "../../../db";
import * as dbTypes from "../../../db/types";

import { addTestingData } from "../../../db/testing_data";

const DevPanel = () => {
  // FIXME: for some reason, the type returned by useRxDb is incompatible with RxDatabase,
  // but still works accordingly.  therefore, for now:
  // @ts-ignore
  const data: RxDatabase = useRxDB();

  console.log(data);

  const clearDb = () => db.clearDocs(data);
  const addTestingDataDb = () => addTestingData(data);

  return <>
    <button onClick={clearDb}>clear the documents</button>
    <button onClick={addTestingDataDb}>add testing data</button>

    </>

};

export default DevPanel;
