import * as Document from "./document";
import * as Data from "./data-node";
import { Service } from ".";

// Excecution... Operation? Completion? Enactment? Realizarion?
//
//   these are records of actions our system has taken
//

export enum Type {
  download_youtube_v1,
  user_added,
}

// TODO for now data link just has the ID in it
export type DataLink = { document__id: Document.Id };

export type Generic<GenericService> = Document.Prototype & {
  document__type: Document.Type.Record;
  record__type: Type;
  record__started_at: Date;
  record__finished_at: Date;
  record__of_data: Service.ExtractArgs<GenericService> | [];
  record__to_data: Service.ExtractReturn<GenericService>;
};

/* prettier-ignore */
export type YoutubeDL =
  Generic<Service.YoutubeDownload> & { record__type: Type.download_youtube_v1 };

/* prettier-ignore */
export type UserAdded =
  Generic<Service.UserAdd> & { record__type: Type.user_added };

export type Record = UserAdded | YoutubeDL;

// here is how these things can be used:
//
//  if you created a service, which takes [string] and returns [string]
type TestService = Service.Generic<[string], [string]>;

// we can then make an execution for that service:
//
type TestRecord = Generic<TestService>;

// then we can make an execution test:
const testRecord: TestRecord = {
  document__id: "testId",
  document__type: Document.Type.Record,
  record__type: Type.user_added,
  record__started_at: new Date(Date.now()),
  record__finished_at: new Date(Date.now()),
  // this fails, because UserAdd has a different Arg type
  // record__of_data: 4,
  // this fails, because UserReturnService has a different Return type
  // record__to_data: 5,
  // this one will pass though, as it's the correct type
  record__of_data: ["i am a string"],
  record__to_data: ["i am a result"],
};

/* prettier-ignore */
const realTestRecord: UserAdded = {
  document__id: "testId",
  document__type: Document.Type.Record,
  record__type: Type.user_added,
  record__started_at: new Date(Date.now()),
  record__finished_at: new Date(Date.now()),
  // this fails, because UserAdd has a different Arg type
  // record__of_data: 4,
  // this fails, because UserReturnService has a different Return type
  // record__to_data: 5,
  //
  // this one will pass though, as it's the correct type
  /* prettier-ignore */
  record__of_data: [{ document__id: "testdata1",
                         document__type: Document.Type.Data,
                         data__type: Data.Type.url,
                         data__body: "" }],
  record__to_data: [{ document__id: "resultingdata",
                         document__type: Document.Type.Data,
                         data__type: Data.Type.url,
                         data__body: "" }]
}
