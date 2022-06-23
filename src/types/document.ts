import { uniqueId } from "@frontend/utils";
// We store all of our different types into the same database
//   So here are the document types
export enum DocumentType {
  Data = "data",
  Execution = "execution",
  Block = "block",
  Page = "page",
}
export type DocumentId = string;

export type DocumentPrototype = {
  "document/type": DocumentType;
  "document/id": string;
};

// creates a new document
export const create = (t: DocumentType): DocumentPrototype => ({
  "document/id": uniqueId(),
  "document/type": t,
});
