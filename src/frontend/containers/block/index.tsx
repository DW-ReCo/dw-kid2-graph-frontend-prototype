import React from "react";
import * as dbTypes from "@db/types";

import * as note from "./note";

const NotFoundType = ({ block }: { block: dbTypes.Block }) => <>Block type {block?.type} not found</>;

const BlockSwitch = ({ db, block }: { db: dbTypes.LoadedDb; block: dbTypes.Block }) =>
  block.type === "note" ? <note.Component db={db} block={block} /> : <NotFoundType block={block} />;

const Block = (props: { db: dbTypes.LoadedDb; block: dbTypes.Block }) => {
  const { block, db } = props;

  return (
    <div className="block">
      <span className="meta-tag">{block.id}</span>
      <span className="meta-tag">{block.document_type}</span>
      <span className="meta-tag">{block.type}</span>
      <BlockSwitch db={db} block={block} />
    </div>
  );
};

export default Block;
