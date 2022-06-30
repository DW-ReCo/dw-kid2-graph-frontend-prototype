import { uniqueId } from "@frontend/utils";

// We store all of our different types into the same database
//   So here are the document types
export enum Type {
  Data = "data",
  Record = "record",
  Block = "block",
  Page = "page",
}
export type Id = string;

export type Prototype = {
  document__type: Type;
  document__id: string;
};

// creates a new document
export const createDocument = () => ({
  document__id: uniqueId(),
});
