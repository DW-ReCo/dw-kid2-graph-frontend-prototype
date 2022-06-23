import * as Queries from "@db/queries";
import * as Types from "@data-types/index";
import Block from "@frontend/containers/block";
import React, { Fragment } from "react";
import { useRxQuery } from "rxdb-hooks";

const PageBlocks = (props: { db: Types.LoadedDb; page: Types.Page }) => {
  const { page, db } = props;
  const { result: docs } = useRxQuery(Queries.pageBlocks(db.instance, page));

  const blocks: Types.Block[] = docs.map((d) => d.get());

  return (
    <>
      {blocks && (
        <>
          {page.page__blocks.map((blockId) => {
            const block = blocks.filter((block) => block.document__id === blockId)[0];
            return <Fragment key={blockId}>{block && <Block db={db} block={block} page={page} />}</Fragment>;
          })}
        </>
      )}
    </>
  );
};

export default PageBlocks;
