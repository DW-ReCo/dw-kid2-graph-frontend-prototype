import * as Types from "@data-types/index";
import * as Rxdb from "rxdb";
import * as Database from "./index";
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
    <Types.DataYoutubeUrl>{
    /* prettier-ignore */
      "document/id": id("data1"),
      "document/type": Types.DocumentType.Data,
      "data/type": "youtube_url",
      "data/body": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    },
    <Types.DataYoutubeUrl>{
      "document/id": id("data2"),
      "document/type": "data" as Types.DocumentType,
      "data/type": "youtube_url",
      "data/body": "https://www.youtube.com/watch?v=uImk2RgCq_U&t=33s",
    },
    <Types.DataVideoFileUrl>{
      "document/id": id("data3"),
      "data/type": "video_file_url",
      "document/type": "data" as const,
      "data/body": { source: "https://www.dw.com" /* TODO link to file */ },
    },
    // //
    // // executions
    // //
    <Types.ExecutionUserAdded>{
      "document/id": id("execution1"),
      "document/type": Types.DocumentType.Execution,
      "execution/type": Types.ExecutionType.user_added,
      "execution/started_at": new Date(Date.now()),
      "execution/finished_at": new Date(Date.now()),
      "execution/of_data": [] as Types.DataLink[],
      "execution/to_data": [{ "document/id": id("data1") }],
    },
    <Types.ExecutionUserAdded>{
      "document/id": id("execution2"),
      "document/type": Types.DocumentType.Execution,
      "execution/type": Types.ExecutionType.user_added,
      "execution/started_at": new Date(Date.now()),
      "execution/finished_at": new Date(Date.now()),
      "execution/of_data": [] as Types.DataLink[],
      "execution/to_data": [{ "document/id": id("data1") }],
    },
    <Types.ExecutionYoutubeDL>{
      "document/id": id("execution3"),
      "document/type": Types.DocumentType.Execution,
      "execution/type": Types.ExecutionType.download_youtube_v1,
      "execution/started_at": new Date(Date.now()),
      "execution/finished_at": new Date(Date.now()),
      "execution/of_data": [{ "document/id": id("data2") }],
      "execution/to_data": [{ "document/id": id("data3") }],
    },
    //
    // blocks
    //
    <Types.BlockNote>{
      "document/id": id("block1"),
      "document/type": "block" as const,
      "block/type": Types.BlockType.note,
      "block/state": "open",
      "block/body": "This is a note" + uniqueId(),
    },
    <Types.BlockYoutubeInput>{
      "document/id": id("block2"),
      "document/type": "block" as const,
      "block/type": Types.BlockType.youtube_url_input,
      "block/state": "open",
      "block/data_id": id("data1"),
    },
    <Types.BlockNote>{
      "document/id": id("block3"),
      "document/type": "block" as const,
      "block/type": Types.BlockType.note,
      "block/state": "open",
      "block/body": "This is another note",
    },
    <Types.BlockYoutubeInput>{
      "document/id": id("block4"),
      "document/type": "block" as const,
      "block/type": Types.BlockType.youtube_url_input,
      "block/state": "open",
      "block/data_id": id("data2"),
    },
    <Types.BlockDownloadedVideo>{
      "document/id": id("block5"),
      "document/type": "block" as const,
      "block/type": Types.BlockType.downloaded_video,
      "block/state": "open",
      "block/data_id": id("data3"),
    },
    //
    // pages
    //
    <Types.Page>{
      "document/id": id("page1"),
      "document/type": "page" as const,
      "page/title": "Page 1" + uniqueId(),
      "page/blocks": [id("block1"), id("block2"), id("block3"), id("block4"), id("block5")],
    },
  ];
};

export const addTestingData = async (instance: Rxdb.RxDatabase) => {
  const docs = generateTestingDocs1("same");
  await Database.upsertDocs(instance, docs);
  return docs;
};
