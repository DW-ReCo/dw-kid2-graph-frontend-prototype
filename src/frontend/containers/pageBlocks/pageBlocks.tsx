import * as queries from "@db/queries";
import * as dbTypes from "@db/types";
import Block from "@frontend/containers/block";
import React from "react";
import { useRxQuery } from "rxdb-hooks";

const PageBlocks = (props: { db: dbTypes.LoadedDb; page: dbTypes.Page }) => {
  const { page, db } = props;
  const { result: docs } = useRxQuery(queries.pageBlocks(db.instance, page));
  const blocks: dbTypes.Block[] = docs.map((d) => d.get());

  return (
    <>
      {blocks.map((b) => (
        <Block key={b.id} db={db} block={b} />
      ))}
    </>
  );
};

export default PageBlocks;
