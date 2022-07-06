import React from "react";

import * as Types from "@data-types/index";

import { getStatusIcon, getStatusMessage } from "@frontend/utils/status";

const RenderStatus = ({ status }: { status: Types.Context.Status }) => (
  <div className="flex items-center">
    <span className="mr-2">{getStatusIcon(status.diagnostic)}</span>
    <span>{getStatusMessage(status.message)}</span>
  </div>
);

export default RenderStatus;
