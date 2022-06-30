import * as Document from "./document";

export enum Type {
  url = "url",
  youtube_url = "youtube_url",
  youtube_downloaded = "youtube_downloaded",
  video_file_url = "video_file_url_v1",
}

export type Prototype = Document.Prototype & {
  document__type: Document.Type.Data;
  data__type: Type;
};

export type URL = Prototype & {
  data__body: string; // url
  data__type: Type.url;
};

export type YoutubeUrl = Prototype & {
  data__type: Type.youtube_url;
  data__body: string;
};

export const newDataYoutubeUrl = (url: string): YoutubeUrl => ({
  ...Document.createDocument(),
  document__type: Document.Type.Data,
  data__type: Type.youtube_url,
  data__body: url,
});

export type VideoFileUrl = Prototype & {
  data__type: "video_file_url";
  data__body: {
    // possibly add format and other data, imported_on, etc
    source: string;
  };
};

// This is the data that the YoutubeDownload Service Produces
export type YoutubeDownloaded = Prototype & {
  data__type: Type.youtube_downloaded;
  data__body: { downloaded_at: string; video_link: string; meta_link: string };
};

export type Data = VideoFileUrl | YoutubeUrl | URL | YoutubeDownloaded;
