import React from "react";
import { getStatusIcon, getStatusMessage } from "@utils/index";
import * as Types from "@data-types/index";

const RenderStatus = ({ status }: { status: Types.Context.Status }) => (
  <div className="block">
    <span className="mr-2">{getStatusIcon(status.diagnostic)}</span>
    <span>{getStatusMessage(status.message)}</span>
  </div>
);

export default RenderStatus;
