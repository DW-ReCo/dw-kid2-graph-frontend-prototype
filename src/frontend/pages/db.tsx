import React from "react";
import DBRenderer from "@frontend/containers/DBRenderer/index";
import useDbContext from "@frontend/hooks/contexts/useDbContext";

const DBPage = () => {
  // @ts-ignore
  const { dbState: dbs } = useDbContext();
  // FIXME this could be undefined

  return <div>{dbs.map(DBRenderer)}</div>;
};

export default DBPage;
