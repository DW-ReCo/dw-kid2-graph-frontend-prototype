import * as Document from "./document";
import { DocumentPrototype, DocumentType, DocumentId } from "./document";

import { Data } from "./data";

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

export type ExecutionPrototype = DocumentPrototype & {
  document__type: DocumentType.Execution;
  execution__type: ExecutionType;
  execution__started_at: Date;
  execution__finished_at: Date;
  execution__of_data: Array<DataLink>;
  execution__to_data: Array<DataLink>;
};
export type ExecutionYoutubeDL = ExecutionPrototype & { execution__type: ExecutionType.download_youtube_v1 };
export type ExecutionUserAdded = ExecutionPrototype & { execution__type: ExecutionType.user_added };

export type Execution = ExecutionUserAdded | ExecutionYoutubeDL;
