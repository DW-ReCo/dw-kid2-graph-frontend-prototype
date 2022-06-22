import React from "react";
import * as DatabaseTypes from "@db/types";

import * as Queries from "@db/queries";

const PageListItem = (props: { db: DatabaseTypes.LoadedDb; page: DatabaseTypes.Page; open: () => void }) => {
  const { page, open, db } = props;

  const updatePageTitle = (newTitle: string) => {
    Queries.mergePage(db.instance, { id: page.id, title: newTitle });
  };

  const remove = (db: DatabaseTypes.LoadedDb, id: string) => Queries.remove(db.instance, id);

  return (
    <div>
      <input onChange={(e) => updatePageTitle(e.target.value)} value={page.title} />
      <button onClick={open}>Open</button>
      <button onClick={() => remove(db, page.id)}>Remove</button>
    </div>
  );
};

export default PageListItem;
