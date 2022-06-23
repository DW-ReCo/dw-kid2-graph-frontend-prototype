import * as Queries from "@db/queries";
import * as DatabaseTypes from "@data-types/index";
import AddBlock from "@frontend/containers/block/addBlock";
import PageBlocks from "@frontend/containers/pageBlocks";
import React from "react";
import { useRxQuery } from "rxdb-hooks";

const Page = (props: { db: DatabaseTypes.LoadedDb; pageID: string }) => {
  const { pageID, db } = props;

  const { result: doc } = useRxQuery(Queries.page(db.instance, pageID));
  const page: DatabaseTypes.Page = doc[0]?.get();
  const blocks = page?.page__blocks || [];

  const onAddBlock = (b: DatabaseTypes.Block) => {
    Queries.mergePage(db.instance, {
      document__id: page.document__id,
      page__blocks: [...blocks, b.document__id],
    });
  };

  if (!page) {
    return <h4>Page Not Found</h4>;
  }

  return (
    <>
      <h1>{page.page__title}</h1>
      <PageBlocks db={db} page={page} />
      <AddBlock db={db} onAdd={onAddBlock} />
    </>
  );
};

export default Page;
