import React, { Fragment } from "react";
import * as DatabaseTypes from "@db/types";
import Page from "@frontend/containers/page";
import Pages from "@frontend/containers/pages";
import useAppContext from "@frontend/hooks/contexts/useAppContext";
import useDbContext, { getActiveDb } from "@frontend/hooks/contexts/useDbContext";

const ApplicationContainer = () => {
  const {
    appState: { activeDb, activePage },
    setAppState,
  } = useAppContext();

  const { dbState: dbs } = useDbContext();

  const openPage = (d: DatabaseTypes.LoadedDb) => (p: DatabaseTypes.Page) => {
    setAppState((prev) => ({ ...prev, activePage: p.id }));
    setAppState((prev) => ({ ...prev, activeDb: d.name }));
  };

  const activeDbInstance = getActiveDb(activeDb, dbs);

  return (
    <div>
      <div style={{ width: "100%", backgroundColor: "beige" }}>
        {dbs.map((d, index) => (
          <Fragment key={index}>
            <Pages db={d} open={openPage(d)} />
          </Fragment>
        ))}
      </div>
      <div>{activePage && activeDb && activeDbInstance && <Page db={activeDbInstance} pageID={activePage} />}</div>
    </div>
  );
};

export default ApplicationContainer;
