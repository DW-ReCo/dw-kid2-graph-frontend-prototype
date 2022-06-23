import * as Document from "./document";
import { DocumentPrototype, DocumentType } from "./document";

export enum DataType {
  url = "url",
  youtube_url = "youtube_url",
  youtube_api_result = "youtuve_api_result_v1",
  video_file_url = "video_file_url_v1",
}

export type DataPrototype = DocumentPrototype & {
  document__type: DocumentType.Data;
  data__type: DataType;
};

export type DataURL = DataPrototype & {
  data__body: URL;
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

export type Data = DataVideoFileUrl | DataYoutubeUrl | DataURL;
