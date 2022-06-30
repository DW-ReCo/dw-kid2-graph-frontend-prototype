import * as Types from "@data-types/index";
import Page from "@frontend/containers/app/page";
import PageList from "@frontend/containers/app/pageList";
import useAppContext from "@frontend/hooks/contexts/useAppContext";
import useDatabaseContext, { getActiveDatabase } from "@frontend/hooks/contexts/useDatabaseContext";
import React, { Fragment } from "react";

const ApplicationContainer = () => {
  const {
    // @ts-ignore
    appState: {
      app: { activeDatabase, activePage },
    },
    // @ts-ignore
    setAppState,
  } = useAppContext();
  // appContext can be undefined FIXME

  // @ts-ignore
  const { dbState: dbs } = useDatabaseContext();
  // dbcontext can be undefined FIXME

  const openPage = (d: Types.Database.LoadedDatabase) => (p: Types.Page.Page) => {
    setAppState((prev) => ({ ...prev, app: { ...prev.app, activePage: p.document__id } }));
    setAppState((prev) => ({ ...prev, app: { ...prev.app, activeDatabase: d.name } }));
  };

  const activeDatabaseInstance = getActiveDatabase(activeDatabase, dbs);

  return (
    <>
      <div style={{ width: "20rem", backgroundColor: "#f7f6f3" }} className="p-2 sticky top-0 left-0 max-h-screen">
        {dbs.map((d, index) => (
          <Fragment key={index}>
            <PageList db={d} open={openPage(d)} />
            {index + 1 < dbs.length && <hr />}
          </Fragment>
        ))}
      </div>
      <div className="p-2 flex-1 mx-auto overflow-scroll">
        {activePage && activeDatabase && activeDatabaseInstance && (
          <Page db={activeDatabaseInstance} pageID={activePage} />
        )}
      </div>
    </>
  );
};

export default ApplicationContainer;
