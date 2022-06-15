import React from "react";
import * as dbTypes from "../../../db/types";

const Block = (props: { db: dbTypes.LoadedDb; block: dbTypes.Block }) => {
  const { db, block } = props;

  return (
    <>
      <h2>{block.document_type}</h2>
      <h3>{block.id}</h3>
    </>
  );
};

export default Block;
