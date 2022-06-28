import * as Queries from "@db/queries";
import * as DatabaseTypes from "@data-types/index";
import AddBlock from "@frontend/containers/block/addBlock";
import PageBlocks from "@frontend/containers/pageBlocks";
import React from "react";
import { useRxQuery } from "rxdb-hooks";
import EditIcon from "@frontend/assets/icons/edit";

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

  const updatePageTitle = (newTitle: string) => {
    Queries.mergePage(db.instance, { document__id: page.document__id, page__title: newTitle });
  };

  if (!page) {
    return (
      <div className="max-w-[60rem] mx-auto py-5">
        <h1>Page Not Found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-[60rem] mx-auto py-5">
      <div className="flex">
        <h1>
          <input value={page.page__title} onChange={(e) => updatePageTitle(e.target.value)} />
        </h1>
        <EditIcon />
      </div>
      <PageBlocks db={db} page={page} />
      <AddBlock db={db} onAdd={onAddBlock} />
    </div>
  );
};

export default Page;
