// Initial data for the database for testing purposes
// helper types
//

// data types
type DataId = string; // todo, maybe uuid
type DataType =
  "url" |
  "youtube_url" |
  "youtube_api_result" |
  "video_file_url";

type Data = { id: DataId; // maybe uuid
              type: DataType;
              payload: object; };

type DataURL = Data & { payload: URL;
                        type: "url"; };

type DataYoutubeUrl = Data & { type: "youtube_url",
                               payload: URL /*  & { host: "youtube.com" | "www.youtube.com" } */; };

type DataVideoFileUrl = Data & { type: "video_file_url";
                              payload: {
                                // possibly add format and other data, imported_on, etc
                                source: URL; }}
// Excecution... Operation? Completion? Enactment? Realizarion?

type ExecutionID = string; // todo uuid or something
type ExecutionType = "download_youtube_v1" | "user_added";

type Execution = { id: ExecutionID; // maybe cpmputed or uuid
                    type: ExecutionType;
                    done_at: Date; }
type ExecutionYoutubeDL = Execution & { type: "download_youtube_v1" }
type ExecutionUserAdded = Execution & { type: "user_added" }

// DataLink
// how data is linked together with excecutions, forming a graph.
//   optional key property in case we want to pipe inputs
//   to specific arguments in the future

type DataLinkType = "result" | "input";

type DataLink = { of: ExecutionID | DataId | "user";
                  to: DataId | ExecutionID;
                  type: DataLinkType;
                  key?: string; }

// the testing data
//   here we define the groups of testing data
//   to use for a testing database

const data: Data[] = [
  <DataYoutubeUrl> { id: "data1",
                     type: "youtube_url",
                     payload: new URL("https://www.youtube.com/watch?v=jNQXAC9IVRw") },
  <DataYoutubeUrl> { id: "data2",
                     type: "youtube_url",
                     payload: new URL("https://www.youtube.com/watch?v=uImk2RgCq_U&t=33s") },
  <DataVideoFileUrl> { id: "data3",
                       type: "video_file_url",
                       payload: { source: new URL("") /* TODO link to file */ }},
]

const executions: Execution[] = [
  <ExecutionUserAdded> { id: "execution1",
                         done_at: new Date(Date.now()),
                         type: "user_added", },
  <ExecutionUserAdded> { id: "execution2",
                         done_at: new Date(Date.now()),
                         type: "user_added", },
  <ExecutionYoutubeDL> { id: "execution3",
                         type: "download_youtube_v1",
                         done_at: new Date(Date.now()), }
]

const links: DataLink[] = [
  <DataLink> { of: "user",       type: "input", to: "data1", },
  <DataLink> { of: "user",       type: "input", to: "data2", },
  <DataLink> { of: "execution3", type: "result", to: "data3", },

]
