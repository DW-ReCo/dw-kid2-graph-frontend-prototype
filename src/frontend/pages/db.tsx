import React from "react";
import DBRenderer from "@frontend/containers/DBRenderer/index";

import { DbsContext } from "./_context";

const DBPage = () => {
  const dbs = React.useContext(DbsContext);
  return <div>{dbs.map(DBRenderer)}</div>;
};

export default DBPage;
