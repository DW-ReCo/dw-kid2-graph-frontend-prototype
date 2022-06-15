import React from "react";
import * as dbTypes from "../../../db/types";
import * as queries from "../../../db/queries";
import Block from "../../components/block";
import { useRxQuery } from "rxdb-hooks";

const PageBlocks = (props: { db: dbTypes.LoadedDb; page: dbTypes.Page }) => {
  const { page, db } = props;
  const { result: docs } = useRxQuery(queries.pageBlocks(db.db, page));
  const blocks: dbTypes.Block[] = docs.map((d) => d.get());

  return (
    <>
      {blocks.map((b) => (
        <Block block={b} />
      ))}
    </>
  );
};

export default PageBlocks;
