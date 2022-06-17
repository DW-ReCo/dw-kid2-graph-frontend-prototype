import { DbsContext } from "./_context";
import DBRenderer from "@frontend/containers/DBRenderer/index";
import React from "react";

const DBPage = () => {
  const dbs = React.useContext(DbsContext);
  return <div>{dbs.map(DBRenderer)}</div>;
};

export default DBPage;
