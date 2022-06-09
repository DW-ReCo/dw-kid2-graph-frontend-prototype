import * as t from "./types";
import * as schema from "./schema";
import * as rxdb from "rxdb";

// the testing data
//   here we define the groups of testing data
//   to use for a testing database

export const data: t.Data[] = [
  <t.DataYoutubeUrl>{
    id: "data1",
    document_type: "data",
    type: "youtube_url",
    body: "https://www.youtube.com/watch?v=jNQXAC9IVRw" },
  <t.DataYoutubeUrl>{
    id: "data2",
    type: "youtube_url",
    document_type: "data" as t.DbDocumentType,
    body: "https://www.youtube.com/watch?v=uImk2RgCq_U&t=33s",
  },
  <t.DataVideoFileUrl>{
    id: "data3",
    type: "video_file_url",
    document_type: "data" as const,
    body: { source: "https://www.dw.com" /* TODO link to file */ },
  },
];

export const executions: t.Execution[] = [
  <t.ExecutionUserAdded>{
    id: "execution1",
    done_at: new Date(Date.now()),
    document_type: "execution" as const,
    type: "user_added",
    of_data: [],
    to_data: [{data_id: "data1"}],
  },
  <t.ExecutionUserAdded>{
    id: "execution2",
    done_at: new Date(Date.now()),
    type: "user_added",
    document_type: "execution" as const,
    of_data: [],
    to_data: [{data_id: "data1"}],},
  <t.ExecutionYoutubeDL>{
    id: "execution3",
    document_type: "execution" as const,
    type: "download_youtube_v1",
    done_at: new Date(Date.now()),
    of_data: [{data_id: "data2"}],
    to_data: [{data_id: "data3"}]},
];
export const blocks: t.Block[] = [
  <t.BlockNote>{
    id: "block1",
    state: "open",
    type: "note",
    document_type: "block" as const,
    body: "This is a note",
  },
  <t.BlockYoutubeInput>{
    id: "block2",
    state: "open",
    type: "youtube_url_input",
    document_type: "block" as const,
    dataId: "data1",
  },
  <t.BlockNote>{
    id: "block3",
    state: "open",
    type: "note",
    document_type: "block" as const,
    body: "This is another note"
  },
  <t.BlockYoutubeInput>{
    id: "block4",
    state: "open",
    type: "youtube_url_input",
    document_type: "block" as const,
    dataId: "data2"
  },
  <t.BlockDownloadedVideo>{
    id: "block5",
    state: "open",
    type: "downloaded_video",
    document_type: "block" as const,
    dataId: "data3"
  },
];

export const pages: t.Page[] = [
  <t.Page>{
    id: "page1",
    title: "Page 1",
    document_type: "page" as const,
    blocks: ["block1", "block2", "block3", "block4", "block5"] },
];


export const addTestingData = async (db: rxdb.RxDatabase) => {

  console.log("aaaaaaaaaaa")
  console.log(db)

  console.log("adding testing data");
  await Promise.all(blocks.map((b) => db.docs.insert(b)));

  console.log("adding testing data");
  await Promise.all(pages.map((e) => db.docs.insert(e)));

  console.log("adding testing data");
  await Promise.all(executions.map((p) => db.docs.insert(p)));

  console.log("adding testing data");
  await Promise.all(data.map((d) => db.docs.insert(d)));
  return db;
};
