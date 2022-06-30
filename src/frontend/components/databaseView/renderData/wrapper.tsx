import React from "react";

type PropType = {
  children: React.ReactNode[];
};
const RenderDataWrapper = ({ children }: PropType) => (
  <div className="flex flex-row gap-2 content-evenly">{children}</div>
);

export default RenderDataWrapper;
