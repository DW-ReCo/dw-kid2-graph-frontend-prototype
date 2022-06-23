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
  document__type: DocumentType.Block;
  block__state: "open" | "closed";
  block__type: BlockType;
};

export type BlockNote = BlockPrototype & {
  block__type: BlockType.note;
  block__body: string;
};

export type BlockYoutubeInput = BlockPrototype & {
  block__type: BlockType.youtube_url_input;
  block__data_id?: Document.DocumentId;
};

export const newBlockYoutubeInput = (): BlockYoutubeInput => ({
  ...Document.createDocument(),
  document__type: DocumentType.Block,
  block__type: BlockType.youtube_url_input,
  block__state: "open" as const,
});

export type BlockDownloadedVideo = BlockPrototype & {
  block__type: BlockType.downloaded_video;
  block__data_id: Document.DocumentId;
};

export type Block = BlockNote | BlockYoutubeInput | BlockDownloadedVideo;

export const isBlock = (doc: Database.Document): doc is Block => doc.document__type === DocumentType.Block;
