import * as Document from "./document";
import * as Database from "./database";
import * as Record from "./execution-record";
import * as Data from "./data-node";

// Blocks
//
//  our systems lingua franca of frontend elements

export enum Type {
  note,
  youtube_url_input,
  downloaded_video,
}

export type Prototype = Document.Prototype & {
  document__type: Document.Type.Block;
  block__state: "open" | "closed";
  block__type: Type;
};

export type Note = Prototype & {
  block__type: Type.note;
  block__body: string;
};

export type YoutubeInput = Prototype & {
  block__type: Type.youtube_url_input;
  block__data_id?: Document.Id;
};

export const newBlockYoutubeInput = (): YoutubeInput => ({
  ...Document.createDocument(),
  document__type: Document.Type.Block,
  block__type: Type.youtube_url_input,
  block__state: "open" as const,
});

export type YoutubeDownload = Prototype & {
  block__type: Type.downloaded_video;
  block__chosen_video?: Data.YoutubeUrl;
  block__youtube_download_record?: Record.YoutubeDL;
};

export type Block = Note | YoutubeInput | YoutubeDownload;

export const isBlock = (doc: Database.Document): doc is Block => doc.document__type === Document.Type.Block;
