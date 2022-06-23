import * as Queries from "@db/queries";
import * as Types from "@data-types/index";
import Block from "@frontend/containers/block";
import React from "react";
import { useRxQuery } from "rxdb-hooks";

const PageBlocks = (props: { db: Types.LoadedDb; page: Types.Page }) => {
  const { page, db } = props;
  const { result: docs } = useRxQuery(Queries.pageBlocks(db.instance, page));

  const blocks: Types.Block[] = docs.map((d) => d.get());

  return (
    <>
      {blocks.map((b) => (
        <Block key={b.document__id} db={db} block={b} />
      ))}
    </>
  );
};

export default PageBlocks;
