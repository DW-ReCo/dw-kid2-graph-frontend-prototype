import React from "react";
import { RxCollection, RxDatabase } from "rxdb";
import { useRxDB } from "rxdb-hooks";
import * as db from "../../../db";
import * as dbTypes from "../../../db/types";

const DevPanel = () => {
  // @ts-ignore
  const data: RxDatabase = useRxDB() as RxDatabase;

  console.log(data);

  const clearDb = _ => db.clearAllCollections(data);
  const recreateDb = _ => db.addCollections(data);

  return <>
    <button onClick={clearDb}>clear all collections</button>
    <button onClick={recreateDb}>recreate db</button>
    </>

};

export default DevPanel;
