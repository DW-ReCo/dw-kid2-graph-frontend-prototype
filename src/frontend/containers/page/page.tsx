import * as queries from "@db/queries";
import * as dbTypes from "@db/types";
import AddBlock from "@frontend/containers/block/addBlock";
import PageBlocks from "@frontend/containers/pageBlocks";
import React from "react";
import { useRxQuery } from "rxdb-hooks";

const Page = (props: { db: dbTypes.LoadedDb; pageID: string }) => {
  const { pageID, db } = props;

  const { result: doc } = useRxQuery(queries.page(db.instance, pageID));
  const page: dbTypes.Page = doc[0]?.get();
  const blocks = page?.blocks || [];

  const onAddBlock = (b: dbTypes.Block) => {
    queries.mergePage(db.instance, { id: page.id, blocks: [...blocks, b.id] });
  };

  if (!page) {
    return <h4>Page Not Found</h4>;
  }

  return (
    <>
      <h1>{page.title}</h1>
      <PageBlocks db={db} page={page} />
      <AddBlock db={db} onAdd={onAddBlock} />
    </>
  );
};

export default Page;
