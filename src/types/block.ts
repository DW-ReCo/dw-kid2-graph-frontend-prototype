import * as Document from "./document";
import * as Database from "./database";
import * as Executions from "./execution-record";
import * as Data from "./data-node";

// Blocks
//
//  our systems lingua franca of frontend elements

export enum BlockType {
  note,
  youtube_url_input,
  downloaded_video,
}

export type BlockPrototype = Document.Prototype & {
  document__type: Document.Type.Block;
  block__state: "open" | "closed";
  block__type: BlockType;
};

export type BlockNote = BlockPrototype & {
  block__type: BlockType.note;
  block__body: string;
};

export type BlockYoutubeInput = BlockPrototype & {
  block__type: BlockType.youtube_url_input;
  block__data_id?: Document.Id;
};

export const newBlockYoutubeInput = (): BlockYoutubeInput => ({
  ...Document.createDocument(),
  document__type: Document.Type.Block,
  block__type: BlockType.youtube_url_input,
  block__state: "open" as const,
});

export type BlockYoutubeDownload = BlockPrototype & {
  block__type: BlockType.downloaded_video;
  block__chosen_video?: Data.DataYoutubeUrl;
  block__youtube_download_execution?: Executions.ExecutionYoutubeDL;
};

export type Block = BlockNote | BlockYoutubeInput | BlockYoutubeDownload;

export const isBlock = (doc: Database.Document): doc is Block => doc.document__type === Document.Type.Block;
