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
export const generateTestingDocs1 = (sym?: string) => {
  const symbol = sym || uniqueId();
  const id = (n: string) => symbol + n;
  return [
    //
    // data
    //
    <Types.Data.YoutubeUrl>{
      document__id: id("data1"),
      document__type: Types.Document.Type.Data,
      data__type: "youtube_url",
      data__body: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    },
    <Types.Data.YoutubeUrl>{
      document__id: id("data2"),
      document__type: "data" as Types.Document.Type,
      data__type: "youtube_url",
      data__body: "https://www.youtube.com/watch?v=uImk2RgCq_U",
    },
    <Types.Data.VideoFileUrl>{
      document__id: id("data3"),
      data__type: "video_file_url",
      document__type: "data" as const,
      data__body: { source: "https://www.dw.com" /* TODO link to file */ },
    },
    // //
    // // executions
    // //
    <Types.Record.UserAdded>{
      document__id: id("execution1"),
      document__type: Types.Document.Type.Record,
      record__type: Types.Record.Type.user_added,
      record__started_at: new Date(Date.now()),
      record__finished_at: new Date(Date.now()),
      record__of_data: [] as Types.Data.Data[],
      record__to_data: [{ document__id: id("data1") }],
    },
    <Types.Record.UserAdded>{
      document__id: id("execution2"),
      document__type: Types.Document.Type.Record,
      record__type: Types.Record.Type.user_added,
      record__started_at: new Date(Date.now()),
      record__finished_at: new Date(Date.now()),
      record__of_data: [] as Types.Data.Data[],
      record__to_data: [{ document__id: id("data1") }],
    },
    <Types.Record.YoutubeDL>{
      document__id: id("execution3"),
      document__type: Types.Document.Type.Record,
      record__type: Types.Record.Type.download_youtube_v1,
      record__started_at: new Date(Date.now()),
      record__finished_at: new Date(Date.now()),
      record__of_data: [{ document__id: id("data2") }],
      record__to_data: [{ document__id: id("data3") }],
    },
    //
    // blocks
    //
    <Types.Block.Note>{
      document__id: id("block1"),
      document__type: "block" as const,
      block__type: Types.Block.Type.note,
      block__state: "open",
      block__body: "This is a note" + uniqueId(),
    },
    <Types.Block.YoutubeInput>{
      document__id: id("block2"),
      document__type: "block" as const,
      block__type: Types.Block.Type.youtube_url_input,
      block__state: "open",
      block__data_id: id("data1"),
    },
    <Types.Block.Note>{
      document__id: id("block3"),
      document__type: "block" as const,
      block__type: Types.Block.Type.note,
      block__state: "open",
      block__body: "This is another note",
    },
    <Types.Block.YoutubeInput>{
      document__id: id("block4"),
      document__type: "block" as const,
      block__type: Types.Block.Type.youtube_url_input,
      block__state: "open",
      block__data_id: id("data2"),
    },
    //
    // pages
    //
    <Types.Page.Page>{
      document__id: id("page1"),
      document__type: "page" as const,
      page__title: "Page 1" + uniqueId(),
      page__blocks: [id("block1"), id("block2"), id("block3"), id("block4"), id("block5")],
    },
  ];
};

export const addTestingData = async (instance: Rxdb.RxDatabase) => {
  const docs = generateTestingDocs1();
  await Database.upsertDocs(instance, docs);
  return docs;
};
