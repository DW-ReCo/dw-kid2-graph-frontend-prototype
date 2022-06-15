import React from "react";
import * as dbTypes from "../../../db/types";

const PageListItem = (props: { page: dbTypes.Page; open: () => void }) => {
  const { page, open } = props;

  return (
    <div>
      {page.title}
      <button onClick={open}>Open</button>
    </div>
  );
};

export default PageListItem;
