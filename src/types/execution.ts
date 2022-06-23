import * as Document from "./document";
import { DocumentPrototype, DocumentType, DocumentId } from "./document";
import { GenericService, UserAddService, YoutubeDlService, ExtractArgs, ExtractReturn } from "./service";
import { Data, DataType } from "./data";

// Excecution... Operation? Completion? Enactment? Realizarion?
//
//   these are records of actions our system has taken
//

export enum ExecutionType {
  download_youtube_v1,
  user_added,
}

// TODO for now data link just has the ID in it
export type DataLink = { document__id: DocumentId };

export type GenericExecution<GenericService> = DocumentPrototype & {
  document__type: DocumentType.Execution;
  execution__type: ExecutionType;
  execution__started_at: Date;
  execution__finished_at: Date;
  execution__of_data: ExtractArgs<GenericService> | [];
  execution__to_data: ExtractReturn<GenericService>;
};

/* prettier-ignore */
export type ExecutionYoutubeDL =
  GenericExecution<YoutubeDlService> & { execution__type: ExecutionType.download_youtube_v1 };

/* prettier-ignore */
export type ExecutionUserAdded =
  GenericExecution<UserAddService> & { execution__type: ExecutionType.user_added };

export type Execution = ExecutionUserAdded | ExecutionYoutubeDL;

// here is how these things can be used:
//
//  if you created a service, which takes [string] and returns [string]
type TestService = GenericService<[string], [string]>;

// we can then make an execution for that service:
//
type TestExecution = GenericExecution<TestService>;

// then we can make an execution test:
const testExecution: TestExecution = {
  document__id: "testId",
  document__type: DocumentType.Execution,
  execution__type: ExecutionType.user_added,
  execution__started_at: new Date(Date.now()),
  execution__finished_at: new Date(Date.now()),
  // this fails, because UserAddService has a different Arg type
  // execution__of_data: 4,
  // this fails, because UserReturnService has a different Return type
  // execution__to_data: 5,
  // this one will pass though, as it's the correct type
  execution__of_data: ["i am a string"],
  execution__to_data: ["i am a result"],
};

/* prettier-ignore */
const realTestExecution: ExecutionUserAdded = {
  document__id: "testId",
  document__type: DocumentType.Execution,
  execution__type: ExecutionType.user_added,
  execution__started_at: new Date(Date.now()),
  execution__finished_at: new Date(Date.now()),
  // this fails, because UserAddService has a different Arg type
  // execution__of_data: 4,
  // this fails, because UserReturnService has a different Return type
  // execution__to_data: 5,
  //
  // this one will pass though, as it's the correct type
  /* prettier-ignore */
  execution__of_data: [{ document__id: "testdata1",
                         document__type: DocumentType.Data,
                         data__type: DataType.url,
                         data__body: "" }],
  execution__to_data: [{ document__id: "resultingdata",
                         document__type: DocumentType.Data,
                         data__type: DataType.url,
                         data__body: "" }]
}
