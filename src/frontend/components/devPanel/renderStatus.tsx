import React from "react";
import * as Types from "@data-types/index";
import { getStatusIcon, getStatusMessage } from "@utils/index";

const RenderStatus = (status: Types.status) => (
  <div className="block">
    <span className="mr-2">{getStatusIcon(status.diagnostic)}</span>
    <span>{getStatusMessage(status.message)}</span>
  </div>
);

export default RenderStatus;
