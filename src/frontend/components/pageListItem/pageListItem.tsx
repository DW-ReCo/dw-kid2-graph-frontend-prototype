import React from "react";
import * as DatabaseTypes from "@data-types/index";

import * as Queries from "@db/queries";
import OpenIcon from "@frontend/assets/icons/open";
import DeleteIcon from "@frontend/assets/icons/delete";

const PageListItem = (props: { db: DatabaseTypes.LoadedDb; page: DatabaseTypes.Page; open: () => void }) => {
  const { page, open, db } = props;

  const updatePageTitle = (newTitle: string) => {
    Queries.mergePage(db.instance, { document__id: page.document__id, page__title: newTitle });
  };

  const remove = (db: DatabaseTypes.LoadedDb, id: string) => Queries.remove(db.instance, id);

  return (
    <li className="inline-flex flex-nowrap">
      <input onChange={(e) => updatePageTitle(e.target.value)} value={page.page__title} className="w-[9rem] p-1" />
      <button onClick={open} className="text-black p-0 bg-transparent hover:bg-transparent hover:text-slate-500">
        <OpenIcon />
      </button>
      <button
        onClick={() => remove(db, page.document__id)}
        className="text-black p-0 bg-transparent hover:bg-transparent hover:text-slate-500"
      >
        <DeleteIcon />
      </button>
    </li>
  );
};

export default PageListItem;
