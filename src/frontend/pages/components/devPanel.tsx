import React from "react";
import { RxCollection, RxDatabase } from "rxdb";
import { useRxDB } from "rxdb-hooks";
import * as db from "../../../db";
import * as dbTypes from "../../../db/types";

const DevPanel = () => {
  // FIXME: for some reason, the type returned by useRxDb is incompatible with RxDatabase,
  // but still works accordingly.  therefore, for now:
  // @ts-ignore
  const data: RxDatabase = useRxDB();

  console.log(data);

  const clearDb = _ => db.clearAllCollections(data);
  const recreateDb = _ => db.addCollections(data);

  return <>
    <button onClick={clearDb}>clear all collections</button>
    <button onClick={recreateDb}>recreate db</button>
    </>

};

export default DevPanel;
