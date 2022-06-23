import * as Queries from "@db/queries";
import * as DatabaseTypes from "@db/types";
import Block from "@frontend/containers/block";
import React, { Fragment } from "react";
import { useRxQuery } from "rxdb-hooks";

const PageBlocks = (props: { db: DatabaseTypes.LoadedDb; page: DatabaseTypes.Page }) => {
  const { page, db } = props;
  const { result: docs } = useRxQuery(Queries.pageBlocks(db.instance, page));

  const blocks: DatabaseTypes.Block[] = docs.map((d) => d.get());

  return (
    <>
      {blocks && (
        <>
          {page.blocks.map((blockId) => {
            const block = blocks.filter((block) => block.id === blockId)[0];
            return <Fragment key={blockId}>{block && <Block db={db} block={block} />}</Fragment>;
          })}
        </>
      )}
    </>
  );
};

export default PageBlocks;
