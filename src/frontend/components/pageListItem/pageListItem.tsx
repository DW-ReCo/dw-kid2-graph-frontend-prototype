import React from "react";
import * as dbTypes from "@db/types";

import * as queries from "@db/queries";

const PageListItem = (props: { db: dbTypes.LoadedDb; page: dbTypes.Page; open: () => void }) => {
  const { page, open, db } = props;

  const updatePageTitle = (newTitle: string) => {
    queries.mergePage(db.instance, { id: page.id, title: newTitle });
  };

  return (
    <div>
      <input onChange={(e) => updatePageTitle(e.target.value)} value={page.title} />
      <button onClick={open}>Open</button>
    </div>
  );
};

export default PageListItem;
