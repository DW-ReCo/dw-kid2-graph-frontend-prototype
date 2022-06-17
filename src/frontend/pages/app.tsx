import { DbsContext } from "./_context";
import * as dbTypes from "@db/types";
import Page from "@frontend/containers/page";
import Pages from "@frontend/containers/pages";
import React, { Fragment } from "react";

const ApplicationContainer = () => {
  const dbs = React.useContext(DbsContext);

  const [activeDb, setDb] = React.useState<dbTypes.LoadedDb>();
  const [activePage, setActivePage] = React.useState<dbTypes.Page["id"]>();

  const openPage = (d: dbTypes.LoadedDb) => (p: dbTypes.Page) => {
    setActivePage(p.id);
    setDb(d);
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
