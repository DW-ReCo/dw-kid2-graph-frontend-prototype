import React from "react";
import * as types from "./types";
import { syntaxHighlight } from "@utils/index";
import DOMPurify from "dompurify";

const RenderData = ({ documents, title }: types.RenderDataPropTypes) => {
  const documentSyntaxHighlighted = syntaxHighlight(JSON.stringify(document, undefined, 2));
  const cleanMarkup = DOMPurify.sanitize(documentSyntaxHighlighted);

  return (
    <div className="flex-1 max-w-1/4">
      <h2>{title}</h2>
      <ul className="pt-4">
        {documents.map((document: object, index: number) => (
          <li key={index} className="pb-2">
            <pre className="text-xs" dangerouslySetInnerHTML={{ __html: cleanMarkup }} />
          </li>
        ))}
      </ul>
    </div>
  );
};
