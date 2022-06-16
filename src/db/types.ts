import * as rxdb from "rxdb";
import { DbConfig } from "../cfg/types";

// We store all of our different types into the same database
//   So here are the document types
export type DbDocumentType = "data" | "execution" | "block" | "page";

export type DbDocumentPrototype = { document_type: DocumentType };

// aptly named "data" types, for different datas we operate on

export type DataId = string; // todo, maybe uuid
export type DataType = "url" | "youtube_url" | "youtube_api_result" | "video_file_url";

export type DataPrototype = DbDocumentPrototype & {
  id: DataId;
  type: DataType;
  document_type: "data";
  body: object;
};
export type DataURL = DataPrototype & { body: URL; type: "url" };

export type DataYoutubeUrl = DataPrototype & {
  type: "youtube_url";
  body: string /* & { host: "youtube.com" | "www.youtube.com" } */;
};

export type DataVideoFileUrl = DataPrototype & {
  type: "video_file_url";
  body: {
    // possibly add format and other data, imported_on, etc
    source: string;
  };
};

export type Data = DataVideoFileUrl | DataYoutubeUrl | DataURL;

// Excecution... Operation? Completion? Enactment? Realizarion?
//
//   these are records of actions our system has taken
//

export type ExecutionID = string; // todo uuid or something
export type ExecutionType = "download_youtube_v1" | "user_added";

export type DataLink = { key?: string; data_id: DataId };

export type ExecutionPrototype = DbDocumentPrototype & {
  id: ExecutionID; // maybe cpmputed or uuid
  type: ExecutionType;
  document_type: "execution";
  done_at: Date;
  of_data: Array<DataLink>;
  to_data: Array<DataLink>;
};
export type ExecutionYoutubeDL = ExecutionPrototype & { type: "download_youtube_v1" };
export type ExecutionUserAdded = ExecutionPrototype & { type: "user_added" };

export type Execution = ExecutionUserAdded | ExecutionYoutubeDL;

// Blocks
//
//  our systems lingua franca of frontend elements

export type BlockID = string; // todo uuid or something
export type BlockType = "note" | "youtube_url_input" | "downloaded_video";
export type BlockPrototype = DbDocumentPrototype & {
  id: BlockID;
  state: "open" | "closed";
  type: BlockType;
  document_type: "block";
};

export type BlockNote = BlockPrototype & { type: "note"; body: string };
export type BlockYoutubeInput = BlockPrototype & { type: "youtube_url_input"; dataId: DataId };
export type BlockDownloadedVideo = BlockPrototype & { type: "downloaded_video"; dataId: DataId };

export type Block = BlockNote | BlockYoutubeInput | BlockDownloadedVideo;

export const isBlock = (doc: DbDocument): doc is Block => doc.document_type === "block";

// Page
//
//   collections of blocks

export type Page = DbDocumentPrototype & { id: string; document_type: "page"; title: string; blocks: BlockID[] };

export type DbDocument = Page | Block | Execution | Data;

export type LoadedDb = DbConfig & { instance: rxdb.RxDatabase };
