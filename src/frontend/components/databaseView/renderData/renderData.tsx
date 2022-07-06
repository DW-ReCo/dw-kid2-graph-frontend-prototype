import DOMPurify from "dompurify";

import React from "react";

import { syntaxHighlight } from "@frontend/utils/index";

const RenderData = ({ documents, title }: { documents: Array<object>; title: string }) => {
  const cleanMarkup = (document: object): string => {
    const documentSyntaxHighlighted = syntaxHighlight(JSON.stringify(document, undefined, 2));
    return DOMPurify.sanitize(documentSyntaxHighlighted);
  };

  return (
    <div className="flex-1 max-w-1/4">
      <h2>{title}</h2>
      <ul className="pt-4">
        {documents.map((document: object, index: number) => (
          <li key={index} className="pb-2">
            <pre className="text-xs" dangerouslySetInnerHTML={{ __html: cleanMarkup(document) }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RenderData;
