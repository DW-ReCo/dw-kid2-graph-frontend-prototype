import React from "react";
import { DbsContext } from "./_context";
import DBRenderer from "../containers/DBRenderer";

const DBPage = () => {
  const dbs = React.useContext(DbsContext);
  return <div>{dbs.map(DBRenderer)}</div>;
};

export default DBPage;
