import React from "react";
import * as dbTypes from "@db/types";
import * as queries from "@db/queries";
import Block from "@frontend/containers/block";
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
