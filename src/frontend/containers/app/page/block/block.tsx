import * as Types from "@data-types/index";
import * as Queries from "@database/queries";
import ArrowIcon from "@frontend/assets/icons/arrow";
import DeleteIcon from "@frontend/assets/icons/delete";
import * as Note from "@frontend/containers/app/page/blocks/note";
import * as DownloadYoutube from "@frontend/containers/app/page/blocks/youtubeDownload";
import * as YoutubeInput from "@frontend/containers/app/page/blocks/youtubeLink";
import { moveElementPosition } from "@frontend/utils";
import { without } from "lodash";
import React from "react";

const NotFoundType = ({ block }: { block: Types.Block.Block }) => <>Block type {block.block__type} not found</>;

/* prettier-ignore */
const BlockSwitch = ({ db, block }: { db: Types.Database.LoadedDatabase; block: Types.Block.Block }) =>
  block.block__type === Types.Block.Type.note               ? <Note.Component db={db} block={block} /> :
  block.block__type === Types.Block.Type.youtube_url_input  ? <YoutubeInput.Component db={db} block={block} /> :
  block.block__type === Types.Block.Type.downloaded_video   ? <DownloadYoutube.Component db={db} block={block} /> :
  <NotFoundType block={block} />;

const Block = (props: { db: Types.Database.LoadedDatabase; block: Types.Block.Block; page: Types.Page.Page }) => {
  const { block, db, page } = props;

  const blockIndex = page.page__blocks.indexOf(block.document__id);

  const blocksLength = page.page__blocks.length;

  const handleIndexUpdate = (blockId: string, indexChange: number) => {
    const fromIndex = page.page__blocks.indexOf(blockId);
    const newPageBlocks = moveElementPosition(page.page__blocks, fromIndex, fromIndex + indexChange);
    Queries.mergePage(db.instance, { document__id: page.document__id, page__blocks: newPageBlocks });
  };

  const handleDelete = (blockId: string): void => {
    Queries.mergePage(db.instance, {
      document__id: page.document__id,
      page__blocks: without(page.page__blocks, blockId),
    });
    Queries.remove(db.instance, blockId);
  };

  const { document__id: id, document__type: documentType, block__type: blockType } = block;

  return (
    <div className="app-block">
      <div className="flex flex-row">
        <div className="flex-1">
          <span className="meta-tag">{id}</span>
          <span className="meta-tag">{documentType}</span>
          <span className="meta-tag">{blockType}</span>
        </div>
        <div>
          {blockIndex !== 0 && blocksLength !== 1 && (
            <button className="bg-transparent hover:bg-transparent text-[]" onClick={() => handleIndexUpdate(id, -1)}>
              <ArrowIcon />
            </button>
          )}
          {blocksLength !== 1 && blocksLength - 1 !== blockIndex && (
            <button className="bg-transparent hover:bg-transparent" onClick={() => handleIndexUpdate(id, 1)}>
              <ArrowIcon className="rotate-180" />
            </button>
          )}
          <button className="bg-transparent hover:bg-transparent" onClick={() => handleDelete(id)}>
            <DeleteIcon />
          </button>
        </div>
      </div>
      <BlockSwitch db={db} block={block} />
    </div>
  );
};

export default Block;
