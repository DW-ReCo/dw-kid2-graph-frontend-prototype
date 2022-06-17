import * as dbTypes from "@db/types";
import React from "react";

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
