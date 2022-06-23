import * as Queries from "@db/queries";
import * as DatabaseTypes from "@db/types";
import Block from "@frontend/containers/block";
import React from "react";
import { useRxQuery } from "rxdb-hooks";

const PageBlocks = (props: { db: DatabaseTypes.LoadedDb; page: DatabaseTypes.Page }) => {
  const { page, db } = props;
  const { result: docs } = useRxQuery(Queries.pageBlocks(db.instance, page));

  const blocks: DatabaseTypes.Block[] = docs.map((d) => d.get());

  return (
    <>
      {blocks.map((b) => (
        <Block key={b.id} db={db} block={b} />
      ))}
    </>
  );
};

export default PageBlocks;
