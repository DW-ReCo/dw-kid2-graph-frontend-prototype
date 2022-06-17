import React from "react";
import * as dbTypes from "@db/types";
import { DbsContext } from "./_context";
import Page from "@frontend/containers/page";
import Pages from "@frontend/containers/pages";

import { get, set } from "lodash/fp";

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
        {dbs.map((d) => (
          <Pages db={d} open={openPage(d)} />
        ))}
      </div>
      <div>{activePage && activeDb && <Page db={activeDb} pageID={activePage} />}</div>
    </div>
  );
};

export default ApplicationContainer;
