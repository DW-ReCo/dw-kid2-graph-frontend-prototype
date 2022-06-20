import React from "react";
import DBRenderer from "@frontend/containers/DBRenderer/index";
import useAppContext from "@frontend/store";

const DBPage = () => {
  const {
    state: { dbs },
  } = useAppContext();
  return <div>{dbs.map(DBRenderer)}</div>;
};

export default DBPage;
