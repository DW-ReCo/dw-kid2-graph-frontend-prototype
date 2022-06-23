import * as Document from "./document";
import { DocumentPrototype, DocumentType } from "./document";

import { Data } from "./data";

// Excecution... Operation? Completion? Enactment? Realizarion?
//
//   these are records of actions our system has taken
//

export enum ExecutionType {
  download_youtube_v1,
  user_added,
}

export type DataLink = Data;

export type ExecutionPrototype = DocumentPrototype & {
  "document/type": DocumentType.Execution;
  "execution/type": ExecutionType;
  "execution/started_at": Date;
  "execution/finished_at": Date;
  "execution/of_data": Array<DataLink>;
  "execution/to_data": Array<DataLink>;
};
export type ExecutionYoutubeDL = ExecutionPrototype & { "execution/type": ExecutionType.download_youtube_v1 };
export type ExecutionUserAdded = ExecutionPrototype & { "execution/type": ExecutionType.user_added };

export type Execution = ExecutionUserAdded | ExecutionYoutubeDL;
