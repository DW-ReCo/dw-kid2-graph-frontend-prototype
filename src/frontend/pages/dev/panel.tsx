import React, { Fragment } from "react";
import * as db from "@db/index";

import { addTestingData } from "../../../db/testing_data";

import { first } from "lodash/fp";
import useAppContext from "@frontend/store/index";

const DevPanel = () => {
  const {
    state: { dbs },
  } = useAppContext();

  const firstDb = first(dbs);

  if (!firstDb) return <>No Db</>;

  const clearDbs = () => dbs.map((d) => db.clearDocs(d.instance));

  const addTestingDataDbs = () => dbs.map((d) => addTestingData(d.instance));

  return (
    <>
      <a href="/db">databases view | </a>
      <a href="/app">application prototype | </a>
      <a href="/config">config editor</a>
      <button onClick={clearDbs}>clear the documents (all dbs)</button>
      <button onClick={addTestingDataDbs}>add testing data (all dbs)</button>
      <>
        Databases:
        {dbs.map((d, index) => (
          <Fragment key={index}>
            <span>{d.name} |</span>
          </Fragment>
        ))}
      </>
    </>
  );
};

export default DevPanel;
