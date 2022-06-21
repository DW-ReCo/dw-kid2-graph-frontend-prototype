import React from "react";
import DBRenderer from "@frontend/containers/DBRenderer/index";
import useDbContext from "@frontend/hooks/contexts/useDbContext";

const DBPage = () => {
  const { dbState: dbs } = useDbContext();

  return <div>{dbs.map(DBRenderer)}</div>;
};

export default DBPage;
