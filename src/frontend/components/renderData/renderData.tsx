import React from "react";
import * as Types from "./types";

const RenderData = ({ documents, title }: Types.RenderDataPropTypes) => (
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
