import React from "react";

interface RenderDataPropTypes {
  documents: Array<object>;
  title: string;
}

const RenderData = ({ documents, title }: RenderDataPropTypes) => (
  <>
    <h2>{title}</h2>
    <ul>
      {documents.map((document: object, index: number) => (
        <li key={index}>
          <pre>{JSON.stringify(document, null, 2)}</pre>
        </li>
      ))}
    </ul>
  </>
);

export default RenderData;
