import * as Queries from "@db/queries";
import * as DatabaseTypes from "@db/types";
import AddBlock from "@frontend/containers/block/addBlock";
import PageBlocks from "@frontend/containers/pageBlocks";
import React from "react";
import { useRxQuery } from "rxdb-hooks";

const Page = (props: { db: DatabaseTypes.LoadedDb; pageID: string }) => {
  const { pageID, db } = props;

  const { result: doc } = useRxQuery(Queries.page(db.instance, pageID));
  const page: DatabaseTypes.Page = doc[0]?.get();
  const blocks = page?.blocks || [];

  const onAddBlock = (b: DatabaseTypes.Block) => {
    Queries.mergePage(db.instance, { id: page.id, blocks: [...blocks, b.id] });
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
