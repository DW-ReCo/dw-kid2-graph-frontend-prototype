import React, { Fragment, useContext } from "react";
import * as db from "@db/index";

import { addTestingData } from "../../../db/testing_data";

import { DbsContext } from "../_context";
import { first } from "lodash/fp";
import { context } from "@store/store";

const DevPanel = () => {
  const dbs = React.useContext(DbsContext);

  const { state } = useContext(context);

  const firstDb = first(dbs);

  if (!firstDb) return <>No Db</>;

  const clearDbs = () => dbs.map((d) => db.clearDocs(d.instance));

  const addTestingDataDbs = () => dbs.map((d) => addTestingData(d.instance));

  return (
    <>
      {JSON.stringify(state)}
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
