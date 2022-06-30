import * as Types from "@data-types/index";
import * as Queries from "@database/queries";
import EditIcon from "@frontend/assets/icons/edit";
import AddBlock from "@frontend/containers/app/page/blocks/addBlock";
import PageBlocks from "@frontend/containers/app/page/pageBlocks";
import React from "react";
import { useRxQuery } from "rxdb-hooks";

const Page = (props: { db: Types.Database.LoadedDatabase; pageID: string }) => {
  const { pageID, db } = props;

  const { result: doc } = useRxQuery(Queries.page(db.instance, pageID));
  const page: Types.Page.Page = doc[0]?.get();
  const blocks = page?.page__blocks || [];

  const onAddBlock = (b: Types.Block.Block) => {
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
