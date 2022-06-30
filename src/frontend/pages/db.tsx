import React from "react";

import DatabaseRenderer from "@frontend/containers/databaseView/databaseRenderer/index";
import useDatabaseContext from "@frontend/hooks/contexts/useDatabaseContext";

const DBPage = () => {
  // @ts-ignore
  const { dbState: dbs } = useDatabaseContext();
  // FIXME this could be undefined

  return <div>{dbs.map(DatabaseRenderer)}</div>;
};

export default DBPage;
