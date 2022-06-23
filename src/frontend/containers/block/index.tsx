import * as Note from "./note";
import * as YoutubeInput from "./youtubeLink";
import * as Types from "@data-types/index";
import React from "react";
import { moveElementPosition } from "@frontend/utils";
import * as Queries from "@db/queries";

const NotFoundType = ({ block }: { block: Types.Block }) => <>Block type {block.block__type} not found</>;

/* prettier-ignore */
const BlockSwitch = ({ db, block }: { db: Types.LoadedDb; block: Types.Block }) =>
  block.block__type === Types.BlockType.note               ? <Note.Component db={db} block={block} /> :
  block.block__type === Types.BlockType.youtube_url_input  ? <YoutubeInput.Component db={db} block={block} /> :
                                                               <NotFoundType block={block} />;

const Block = (props: { db: Types.LoadedDb; block: Types.Block, page: Types.Page }) => {
  const { block, db, page } = props;

  const blockIndex = page.page__blocks.indexOf(block.document__id);

  const blocksLength = page.page__blocks.length;

  const handleIndexUpdate = (blockId: string, indexChange: number) => {
    const fromIndex = page.page__blocks.indexOf(blockId);
    const newPageBlocks = moveElementPosition(page.page__blocks, fromIndex, fromIndex + indexChange);
    Queries.mergePage(db.instance, { document__id: page.document__id, page__blocks: newPageBlocks });
  };

  const { document__id: id, document__type: documentType, block__type: blockType } = block;

  return (
    <div className="block">
      <span className="meta-tag">{id}</span>
      <span className="meta-tag">{documentType}</span>
      <span className="meta-tag">{blockType}</span>
      {blockIndex !== 0 && blocksLength !== 1 && <button onClick={() => handleIndexUpdate(id, -1)}>up</button>}
      {blocksLength !== 1 && blocksLength - 1 !== blockIndex && (
        <button onClick={() => handleIndexUpdate(id, 1)}>down</button>
      )}

      <BlockSwitch db={db} block={block} />
    </div>
  );
};

export default Block;
