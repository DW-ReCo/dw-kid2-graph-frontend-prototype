import React, { Fragment } from "react";
import * as dbTypes from "@db/types";
import Page from "@frontend/containers/page";
import Pages from "@frontend/containers/pages";
import useAppContext from "@frontend/hooks/contexts/useAppContext";
import useDbContext from "@frontend/hooks/contexts/useDbContext";

const ApplicationContainer = () => {
  const {
    appState: { activeDb, activePage },
    setAppState,
  } = useAppContext();

  const { dbState: dbs } = useDbContext();

  const openPage = (d: dbTypes.LoadedDb) => (p: dbTypes.Page) => {
    setAppState((prev) => ({ ...prev, activePage: p.id }));
    setAppState((prev) => ({ ...prev, activeDb: d }));

    console.log(`opening page ${p.title}`);
  };

  return (
    <div>
      <div style={{ width: "30%", backgroundColor: "beige", float: "left" }}>
        {dbs.map((d, index) => (
          <Fragment key={index}>
            <Pages db={d} open={openPage(d)} />
          </Fragment>
        ))}
      </div>
      <div>{activePage && activeDb && <Page db={activeDb} pageID={activePage} />}</div>
    </div>
  );
};

export default ApplicationContainer;
