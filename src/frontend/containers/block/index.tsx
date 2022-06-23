import * as Note from "./note";
import * as YoutubeInput from "./youtubeLink";
import * as DatabaseTypes from "@db/types";
import React from "react";
import { moveElementPosition } from "@frontend/utils";
import * as Queries from "@db/queries";

const NotFoundType = ({ block }: { block: DatabaseTypes.Block }) => <>Block type {block?.type} not found</>;

/* prettier-ignore */
const BlockSwitch = ({ db, block }: { db: DatabaseTypes.LoadedDb; block: DatabaseTypes.Block }) =>
  block.type === "note"               ? <Note.Component db={db} block={block} /> :
  block.type === "youtube_url_input"  ? <YoutubeInput.Component db={db} block={block} /> :
                                        <NotFoundType block={block} />;

const Block = (props: { db: DatabaseTypes.LoadedDb; block: DatabaseTypes.Block; page: DatabaseTypes.Page }) => {
  const { block, db, page } = props;

  const blockIndex = page.blocks.indexOf(block.id);

  const blocksLength = page.blocks.length;

  const handleIndexUpdate = (blockId: string, indexChange: number) => {
    const fromIndex = page.blocks.indexOf(blockId);
    const newPageBlocks = moveElementPosition(page.blocks, fromIndex, fromIndex + indexChange);
    Queries.mergePage(db.instance, { id: page.id, blocks: newPageBlocks });
  };

  return (
    <div className="block">
      <span className="meta-tag">{block.id}</span>
      <span className="meta-tag">{block.document_type}</span>
      <span className="meta-tag">{block.type}</span>
      {blockIndex !== 0 && blocksLength !== 1 && <button onClick={() => handleIndexUpdate(block.id, -1)}>up</button>}
      {blocksLength !== 1 && blocksLength - 1 !== blockIndex && (
        <button onClick={() => handleIndexUpdate(block.id, 1)}>down</button>
      )}
      <BlockSwitch db={db} block={block} />
    </div>
  );
};

export default Block;
