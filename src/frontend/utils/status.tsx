import clsx from "clsx";

import React from "react";

import * as Types from "@data-types/index";

import { STATUS_MESSAGES } from "./statusMessages";

export const getStatusIcon = (statusCode: Types.Context.Diagnostic) => {
  const STATUS_CODES = [
    { diagnostic: "INITIAL", className: "bg-white" },
    { diagnostic: "OK", className: "bg-green-400" },
    { diagnostic: "LOADING", className: "bg-yellow-400" },
    { diagnostic: "ERROR", className: "bg-red-400" },
  ];

  const bgClassName = STATUS_CODES.filter(({ diagnostic }) => diagnostic === statusCode)[0]?.className;
  return bgClassName ? <span className={clsx("status-icon", bgClassName)}></span> : <span>{statusCode}</span>;
};

export const getStatusMessage = (messageCode: string): string => {
  const message = STATUS_MESSAGES.filter(({ messageCode: code }) => code === messageCode)[0]?.message;
  return message ? message : `"${messageCode}" NOT FOUND`;
};
