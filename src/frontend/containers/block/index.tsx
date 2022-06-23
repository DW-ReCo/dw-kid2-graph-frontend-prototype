import * as Note from "./note";
import * as YoutubeInput from "./youtubeLink";
import * as Types from "@data-types/index";
import React from "react";

const NotFoundType = ({ block }: { block: Types.Block }) => <>Block type {block.block__type} not found</>;

/* prettier-ignore */
const BlockSwitch = ({ db, block }: { db: Types.LoadedDb; block: Types.Block }) =>
  block.block__type === Types.BlockType.note               ? <Note.Component db={db} block={block} /> :
  block.block__type === Types.BlockType.youtube_url_input  ? <YoutubeInput.Component db={db} block={block} /> :
                                                               <NotFoundType block={block} />;

const Block = (props: { db: Types.LoadedDb; block: Types.Block }) => {
  const { block, db } = props;

  const { document__id: id, document__type: documentType, block__type: blockType } = block;

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
