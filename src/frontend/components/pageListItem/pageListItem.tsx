import React from "react";
import * as DatabaseTypes from "@db/types";

import * as Queries from "@db/queries";
import OpenIcon from "@frontend/assets/icons/open";
import DeleteIcon from "@frontend/assets/icons/delete";

const PageListItem = (props: { db: DatabaseTypes.LoadedDb; page: DatabaseTypes.Page; open: () => void }) => {
  const { page, open, db } = props;

  const updatePageTitle = (newTitle: string) => {
    Queries.mergePage(db.instance, { id: page.id, title: newTitle });
  };

  const remove = (db: DatabaseTypes.LoadedDb, id: string) => Queries.remove(db.instance, id);

  return (
    <li className="inline-flex flex-nowrap">
      <input onChange={(e) => updatePageTitle(e.target.value)} value={page.title} className="w-[9rem] p-1" />
      <button onClick={open} className="text-black p-0 bg-transparent hover:bg-transparent hover:text-slate-500">
        <OpenIcon />
      </button>
      <button
        onClick={() => remove(db, page.id)}
        className="text-black p-0 bg-transparent hover:bg-transparent hover:text-slate-500"
      >
        <DeleteIcon />
      </button>
    </li>
  );
};

export default PageListItem;
