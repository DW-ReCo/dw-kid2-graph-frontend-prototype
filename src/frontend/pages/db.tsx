import DatabaseRenderer from "@frontend/containers/databaseView/databaseRenderer/index";
import useDatabaseContext from "@frontend/hooks/contexts/useDatabaseContext";
import React from "react";

const DBPage = () => {
  // @ts-ignore
  const { dbState: dbs } = useDatabaseContext();
  // FIXME this could be undefined

  return <div>{dbs.map(DatabaseRenderer)}</div>;
};

export default DBPage;
