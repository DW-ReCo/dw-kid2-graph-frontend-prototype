import React, { Fragment } from "react";
import * as dbTypes from "@db/types";
import Page from "@frontend/containers/page";
import Pages from "@frontend/containers/pages";
import useAppContext from "@frontend/store";

const ApplicationContainer = () => {
  const {
    state: {
      dbs,
      appState: { activeDb, activePage },
    },
    setState,
  } = useAppContext();

  const openPage = (d: dbTypes.LoadedDb) => (p: dbTypes.Page) => {
    setState((prev) => ({ ...prev, appState: { ...prev.appState, activePage: p.id } }));
    setState((prev) => ({ ...prev, appState: { ...prev.appState, activeDb: d } }));
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
