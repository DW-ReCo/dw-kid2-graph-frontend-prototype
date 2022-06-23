import * as Document from "./document";
import { DocumentPrototype, DocumentType } from "./document";
import * as Database from "./database";

// Blocks
//
//  our systems lingua franca of frontend elements

export enum BlockType {
  note,
  youtube_url_input,
  downloaded_video,
}

export type BlockPrototype = DocumentPrototype & {
  "document/type": DocumentType.Block;
  "block/state": "open" | "closed";
  "block/type": BlockType;
};

const b: BlockPrototype = {
  "document/type": DocumentType.Block,
  "document/id": "saddas",
  "block/state": "open",
  "block/type": BlockType.note,
};

export type BlockNote = BlockPrototype & {
  "block/type": BlockType.note;
  "block/body": string;
};

export type BlockYoutubeInput = BlockPrototype & {
  "block/type": BlockType.youtube_url_input;
  "block/data_id"?: Document.DocumentId;
};

export const newBlockYoutubeInput = (): BlockYoutubeInput => ({
  ...Document.createDocument(),
  "document/type": DocumentType.Block,
  "block/type": BlockType.youtube_url_input,
  "block/state": "open" as const,
});

export type BlockDownloadedVideo = BlockPrototype & {
  "block/type": BlockType.downloaded_video;
  "block/data_id": Document.DocumentId;
};

export type Block = BlockNote | BlockYoutubeInput | BlockDownloadedVideo;

export const isBlock = (doc: Database.Document): doc is Block => doc["document/type"] === DocumentType.Block;
