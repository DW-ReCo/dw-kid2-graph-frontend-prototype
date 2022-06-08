import * as t from "./types";

// the testing data
//   here we define the groups of testing data
//   to use for a testing database

export const data: t.Data[] = [
  <t.DataYoutubeUrl>{ id: "data1", type: "youtube_url", body: "https://www.youtube.com/watch?v=jNQXAC9IVRw" },
  <t.DataYoutubeUrl>{
    id: "data2",
    type: "youtube_url",
    body: "https://www.youtube.com/watch?v=uImk2RgCq_U&t=33s",
  },
  <t.DataVideoFileUrl>{
    id: "data3",
    type: "video_file_url",
    body: { source: "https://www.dw.com" /* TODO link to file */ },
  },
];

export const executions: t.Execution[] = [
  <t.ExecutionUserAdded>{ id: "execution1", done_at: new Date(Date.now()), type: "user_added" },
  <t.ExecutionUserAdded>{ id: "execution2", done_at: new Date(Date.now()), type: "user_added" },
  <t.ExecutionYoutubeDL>{ id: "execution3", type: "download_youtube_v1", done_at: new Date(Date.now()) },
];

export const links: t.DataLink[] = [
  <t.DataLink>{ id: "user-data1", of: "user", type: "input", to: "data1" },
  <t.DataLink>{ id: "user-data2", of: "user", type: "input", to: "data2" },
  <t.DataLink>{ id: "execution3-data3", of: "execution3", type: "result", to: "data3" },
];

export const blocks: t.Block[] = [
  <t.BlockNote>{ id: "block1", state: "open", type: "note", body: "This is a note" },
  <t.BlockYoutubeInput>{ id: "block2", state: "open", type: "youtube_url_input", dataId: "data1" },
  <t.BlockNote>{ id: "block3", state: "open", type: "note", body: "This is another note" },
  <t.BlockYoutubeInput>{ id: "block4", state: "open", type: "youtube_url_input", dataId: "data2" },
  <t.BlockDownloadedVideo>{ id: "block5", state: "open", type: "downloaded_video", dataId: "data3" },
];

export const pages: t.Page[] = [
  <t.Page>{ id: "page1", title: "Page 1", blocks: ["block1", "block2", "block3", "block4", "block5"] },
];
