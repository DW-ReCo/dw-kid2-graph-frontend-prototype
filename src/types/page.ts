import * as Document from "./document";
import { DocumentPrototype, DocumentType } from "./document";

// Page
//
//   collections of blocks

export type Page = DocumentPrototype & {
  document__type: DocumentType.Page;
  page__title: string;
  page__blocks: Document.DocumentId[];
};
