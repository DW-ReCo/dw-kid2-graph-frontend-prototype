import React, { Fragment } from "react";
import * as db from "@db/index";

import { addTestingData } from "../../../db/testing_data";

import { first } from "lodash/fp";
import useDbContext from "@frontend/hooks/contexts/useDbContext";

import Link from "next/link";

const DevPanel = () => {
  const { dbState: dbs } = useDbContext();

  const firstDb = first(dbs);

  if (!firstDb) return <>No Db</>;

  const clearDbs = () => dbs.map((d) => db.clearDocs(d.instance));

  const addTestingDataDbs = () => dbs.map((d) => addTestingData(d.instance));

  return (
    <>
      <Link href="/db">
        <a>databases view | </a>
      </Link>
      <Link href="/app">
        <a>application prototype | </a>
      </Link>
      <Link href="/config">
        <a>config editor</a>
      </Link>
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
