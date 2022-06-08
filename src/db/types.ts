// data types
export type DataId = string; // todo, maybe uuid
export type DataType = "url" | "youtube_url" | "youtube_api_result" | "video_file_url";

export type Data = { id: DataId; type: DataType; body: object };

export type DataURL = Data & { body: URL; type: "url" };

export type DataYoutubeUrl = Data & {
  type: "youtube_url";
  body: string /* & { host: "youtube.com" | "www.youtube.com" } */;
};

export type DataVideoFileUrl = Data & {
  type: "video_file_url";
  body: {
    // possibly add format and other data, imported_on, etc
    source: string;
  };
};

// Excecution... Operation? Completion? Enactment? Realizarion?

export type ExecutionID = string; // todo uuid or something
export type ExecutionType = "download_youtube_v1" | "user_added";

export type Execution = {
  id: ExecutionID; // maybe cpmputed or uuid
  type: ExecutionType;
  done_at: Date;
};
export type ExecutionYoutubeDL = Execution & { type: "download_youtube_v1" };
export type ExecutionUserAdded = Execution & { type: "user_added" };

// DataLink
// how data is linked together with excecutions, forming a graph.
//   optional key property in case we want to pipe inputs
//   to specific arguments in the future

export type DataLinkType = "result" | "input";

export type DataLink = {
  of: ExecutionID | DataId | "user";
  to: DataId | ExecutionID;
  type: DataLinkType;
  key?: string;
};
export type BlockID = string; // todo uuid or something
export type BlockType = "note" | "youtube_url_input" | "downloaded_video";
export type Block = { id: BlockID; state: "open" | "closed"; type: BlockType };

export type BlockNote = Block & { type: "note"; body: string };
export type BlockYoutubeInput = Block & { type: "youtube_url_input"; dataId: DataId };
export type BlockDownloadedVideo = Block & { type: "downloaded_video"; dataId: DataId };
export type Page = { id: string; title: string; blocks: BlockID[] };
