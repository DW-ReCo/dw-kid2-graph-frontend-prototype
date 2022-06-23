import * as Document from "./document";
import { DocumentPrototype, DocumentType } from "./document";

// Page
//
//   collections of blocks

export type Page = DocumentPrototype & {
  "document/type": DocumentType.Page;
  "page/title": string;
  "page/blocks": Document.DocumentId[];
};
