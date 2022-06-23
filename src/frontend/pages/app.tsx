import React, { Fragment } from "react";
import * as Types from "@data-types/index";
import Page from "@frontend/containers/page";
import Pages from "@frontend/containers/pages";
import useAppContext from "@frontend/hooks/contexts/useAppContext";
import useDbContext, { getActiveDb } from "@frontend/hooks/contexts/useDbContext";

const ApplicationContainer = () => {
  const {
    // @ts-ignore
    appState: { activeDb, activePage },
    // @ts-ignore
    setAppState,
  } = useAppContext();
  // appContext can be undefined FIXME

  // @ts-ignore
  const { dbState: dbs } = useDbContext();
  // dbcontext can be undefined FIXME

  const openPage = (d: Types.LoadedDb) => (p: Types.Page) => {
    setAppState((prev) => ({ ...prev, activePage: p["document/id"] }));
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
