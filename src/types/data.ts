import * as Document from "./document";
import { DocumentPrototype, DocumentType } from "./document";

export enum DataType {
  url = "url",
  youtube_url = "youtube_url",
  youtube_downloaded = "youtube_downloaded",
  video_file_url = "video_file_url_v1",
}

export type DataPrototype = DocumentPrototype & {
  document__type: DocumentType.Data;
  data__type: DataType;
};

export type DataURL = DataPrototype & {
  data__body: string; // url
  data__type: DataType.url;
};

export type DataYoutubeUrl = DataPrototype & {
  data__type: DataType.youtube_url;
  data__body: string;
};

export const newDataYoutubeUrl = (url: string): DataYoutubeUrl => ({
  ...Document.createDocument(),
  document__type: DocumentType.Data,
  data__type: DataType.youtube_url,
  data__body: url,
});

export type DataVideoFileUrl = DataPrototype & {
  data__type: "video_file_url";
  data__body: {
    // possibly add format and other data, imported_on, etc
    source: string;
  };
};

// This is the data that the YoutubeDownload Service Produces
export type DataYoutubeDownloaded = DataPrototype & {
  data__type: DataType.youtube_downloaded;
  data__body__downloaded_at: string;
  data__body__video_link: string;
  data__body__meta_link: string;
};

export type Data = DataVideoFileUrl | DataYoutubeUrl | DataURL | DataYoutubeDownloaded;
