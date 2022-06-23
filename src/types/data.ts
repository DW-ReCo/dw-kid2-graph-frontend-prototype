import * as Document from "./document";
import { DocumentPrototype, DocumentType } from "./document";

export enum DataType {
  url = "url",
  youtube_url = "youtube_url",
  youtube_api_result = "youtuve_api_result_v1",
  video_file_url = "video_file_url_v1",
}

export type DataPrototype = DocumentPrototype & {
  "data/type": DataType;
  "document/type": DocumentType.Data;
};

export type DataURL = DataPrototype & {
  "data/body": URL;
  "data/type": DataType.url;
};

export type DataYoutubeUrl = DataPrototype & {
  "data/type": DataType.youtube_url;
  "data/body": string;
};

export const newDataYoutubeUrl = (url: string): DataYoutubeUrl => ({
  ...Document.createDocument(),
  "document/type": DocumentType.Data,
  "data/type": DataType.youtube_url,
  "data/body": url,
});

export type DataVideoFileUrl = DataPrototype & {
  "data/type": "video_file_url";
  "data/body": {
    // possibly add format and other data, imported_on, etc
    source: string;
  };
};

export type Data = DataVideoFileUrl | DataYoutubeUrl | DataURL;
