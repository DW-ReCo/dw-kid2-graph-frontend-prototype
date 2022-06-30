import * as Document from "./document";

// Page
//
//   collections of blocks

export type Page = Document.Prototype & {
  document__type: Document.Type.Page;
  page__title: string;
  page__blocks: Document.Id[];
};
