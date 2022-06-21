import * as t from "./types";
import * as rxdb from "rxdb";
import * as db from "./index";
import { uniqueId } from "@frontend/utils/index";

// the testing data
//   here we define the groups of testing data
//   to use for a testing database
//
//

// generate testing data
//   optionally takes a symbol to prefix the ids with, otherwise we will generate a random one
/* prettier-ignore */
export const generateTestingDocs1 = (sym?: string) => {
  const symbol = sym || uniqueId();
  const id = (n: string) => symbol + n;
  return [
    //
    // data
    //
    /* prettier-ignore */
    <t.DataYoutubeUrl>{
    /* prettier-ignore */
      id: id("data1"),
      document_type: "data",
      type: "youtube_url",
      body: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    },
    <t.DataYoutubeUrl>{
      id: id("data2"),
      type: "youtube_url",
      document_type: "data" as t.DbDocumentType,
      body: "https://www.youtube.com/watch?v=uImk2RgCq_U&t=33s",
    },
    <t.DataVideoFileUrl>{
      id: id("data3"),
      type: "video_file_url",
      document_type: "data" as const,
      body: { source: "https://www.dw.com" /* TODO link to file */ },
    },
    // //
    // // executions
    // //
    <t.ExecutionUserAdded>{
      id: id("execution1"),
      done_at: new Date(Date.now()),
      document_type: "execution" as const,
      type: "user_added",
      of_data: [] as t.DataLink[],
      to_data: [{ data_id: id("data1") }],
    },
    <t.ExecutionUserAdded>{
      id: id("execution2"),
      done_at: new Date(Date.now()),
      type: "user_added",
      document_type: "execution" as const,
      of_data: [] as t.DataLink[],
      to_data: [{ data_id: id("data1") }],
    },
    <t.ExecutionYoutubeDL>{
      id: id("execution3"),
      document_type: "execution" as const,
      type: "download_youtube_v1",
      done_at: new Date(Date.now()),
      of_data: [{ data_id: id("data2") }],
      to_data: [{ data_id: id("data3") }],
    },
    //
    // blocks
    //
    <t.BlockNote>{
      id: id("block1"),
      state: "open",
      type: "note",
      document_type: "block" as const,
      body: "This is a note" + uniqueId(),
    },
    <t.BlockYoutubeInput>{
      id: id("block2"),
      state: "open",
      type: "youtube_url_input",
      document_type: "block" as const,
      dataId: id("data1"),
    },
    <t.BlockNote>{
      id: id("block3"),
      state: "open",
      type: "note",
      document_type: "block" as const,
      body: "This is another note",
    },
    <t.BlockYoutubeInput>{
      id: id("block4"),
      state: "open",
      type: "youtube_url_input",
      document_type: "block" as const,
      dataId: id("data2"),
    },
    <t.BlockDownloadedVideo>{
      id: id("block5"),
      state: "open",
      type: "downloaded_video",
      document_type: "block" as const,
      dataId: id("data3"),
    },
    //
    // pages
    //
    <t.Page>{
      id: id("page1"),
      title: "Page 1" + uniqueId(),
      document_type: "page" as const,
      blocks: [id("block1"), id("block2"), id("block3"), id("block4"), id("block5")],
    },
  ];
};

export const addTestingData = async (instance: rxdb.RxDatabase) => {
  const docs = generateTestingDocs1("same");
  await db.upsertDocs(instance, docs);
  return docs;
};
