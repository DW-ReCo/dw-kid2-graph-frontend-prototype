import * as Types from "@data-types/index";

import { STATUS_MESSAGES } from "./statusMessages";

export const now = (): Date => new Date(Date.now());

export const syntaxHighlight = (json: string): string => {
  json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    },
  );
};

export const getStatusIcon = (statusCode: Types.Context.Diagnostic) => {
  const STATUS_CODES = [
    { diagnostic: "INITIAL", icon: "🕑" },
    { diagnostic: "OK", icon: "🟢" },
    { diagnostic: "LOADING", icon: "🟡" },
    { diagnostic: "ERROR", icon: "🔴" },
  ];

  const icon = STATUS_CODES.filter(({ diagnostic }) => diagnostic === statusCode)[0]?.icon;
  return icon ? icon : statusCode;
};

export const getStatusMessage = (messageCode: string): string => {
  const message = STATUS_MESSAGES.filter(({ messageCode: code }) => code === messageCode)[0]?.message;
  return message ? message : `"${messageCode}" NOT FOUND`;
};
