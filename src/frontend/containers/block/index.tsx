import * as Note from "./note";
import * as YoutubeInput from "./youtubeLink";
import * as DatabaseTypes from "@db/types";
import React from "react";

const NotFoundType = ({ block }: { block: DatabaseTypes.Block }) => <>Block type {block?.type} not found</>;

/* prettier-ignore */
const BlockSwitch = ({ db, block }: { db: DatabaseTypes.LoadedDb; block: DatabaseTypes.Block }) =>
  block.type === "note"               ? <Note.Component db={db} block={block} /> :
  block.type === "youtube_url_input"  ? <YoutubeInput.Component db={db} block={block} /> :
                                        <NotFoundType block={block} />;

const Block = (props: { db: DatabaseTypes.LoadedDb; block: DatabaseTypes.Block }) => {
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
