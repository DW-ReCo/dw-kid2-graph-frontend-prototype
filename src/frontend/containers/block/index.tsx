import * as Note from "./note";
import * as YoutubeInput from "./youtubeLink";
import * as Types from "@data-types/index";
import React from "react";

const NotFoundType = ({ block }: { block: Types.Block }) => <>Block type {block["block/type"]} not found</>;

/* prettier-ignore */
const BlockSwitch = ({ db, block }: { db: Types.LoadedDb; block: Types.Block }) =>
  block["block/type"] === Types.BlockType.note               ? <Note.Component db={db} block={block} /> :
  block["block/type"] === Types.BlockType.youtube_url_input  ? <YoutubeInput.Component db={db} block={block} /> :
                                                               <NotFoundType block={block} />;

const Block = (props: { db: Types.LoadedDb; block: Types.Block }) => {
  const { block, db } = props;

  const { "document/id": id, "document/type": documentType, "block/type": blockType } = block;

  return (
    <div className="block">
      <span className="meta-tag">{id}</span>
      <span className="meta-tag">{documentType}</span>
      <span className="meta-tag">{blockType}</span>
      <BlockSwitch db={db} block={block} />
    </div>
  );
};

export default Block;
