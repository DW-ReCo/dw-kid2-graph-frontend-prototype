import React from "react";
import DBRenderer from "@frontend/containers/DBRenderer/index";
import useDatabaseContext from "@frontend/hooks/contexts/useDatabaseContext";

const DBPage = () => {
  // @ts-ignore
  const { dbState: dbs } = useDatabaseContext();
  // FIXME this could be undefined

  return <div>{dbs.map(DBRenderer)}</div>;
};

export default DBPage;
