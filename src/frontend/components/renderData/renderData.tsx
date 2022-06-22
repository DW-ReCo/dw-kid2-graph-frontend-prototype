import React from "react";
import * as types from "./types";
import { syntaxHighlight } from "@utils/index";

const RenderData = ({ documents, title }: types.RenderDataPropTypes) => (
  <div className="flex-1 max-w-1/4">
    <h2>{title}</h2>
    <ul className="pt-4">
      {documents.map((document: object, index: number) => (
        <li key={index} className="pb-2">
          <pre
            className="text-xs"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(document, undefined, 2)) }}
          />
        </li>
      ))}
    </ul>
  </div>
);

export default RenderData;
