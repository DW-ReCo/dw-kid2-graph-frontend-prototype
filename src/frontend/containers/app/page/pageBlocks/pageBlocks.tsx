import { useRxQuery } from "rxdb-hooks";

import React, { Fragment } from "react";

import * as Types from "@data-types/index";

import * as Queries from "@database/queries";

import Block from "@frontend/containers/app/page/block";

const PageBlocks = (props: { db: Types.Database.LoadedDatabase; page: Types.Page.Page }) => {
  const { page, db } = props;
  const { result: docs } = useRxQuery(Queries.pageBlocks(db.instance, page));

  const blocks: Types.Block.Block[] = docs.map((d) => d.get());

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
