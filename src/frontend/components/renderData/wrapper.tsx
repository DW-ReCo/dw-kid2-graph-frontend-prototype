import React from "react";

const RenderDataWrapper = ({ children }: { children: React.ReactNode[] }) => (
  <div className="flex flex-row gap-2 content-evenly">{children}</div>
);

export default RenderDataWrapper;
