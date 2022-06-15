import React from "react";
import * as dbTypes from "../../../db/types";

const PageListItem = (dbL: dbTypes.LoadedDb, page: dbTypes.Page, open: () => void) => (
  <div>
    {page.title}
    <button onClick={open}>Open</button>
  </div>
);

export default PageListItem;
