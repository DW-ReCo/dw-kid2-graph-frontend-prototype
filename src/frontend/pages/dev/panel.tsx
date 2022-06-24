// eslint-disable @typescript-eslint/no-unused-vars

import React, { Fragment, useState } from "react";
import * as Database from "@db/index";

import * as Types from "@data-types/index";

import { addTestingData } from "../../../db/testing_data";

import { first } from "lodash/fp";
import useDbContext from "@frontend/hooks/contexts/useDbContext";

import Link from "next/link";
import clsx from "clsx";
import useAppContext from "@frontend/hooks/contexts/useAppContext";

const DevPanel = () => {
  // @ts-ignore
  const { dbState: dbs } = useDbContext();

  const { appState } = useAppContext();
  // dbContext can be undefined FIXME

  const [devPanelState, setDevPanelState] = useState(true);

  const firstDb = first(dbs);

  if (!firstDb) return <>No Db</>;

  const clearDbs = () => dbs.map((d: Types.LoadedDb) => Database.clearDocs(d.instance));

  const addTestingDataDbs = () => dbs.map((d: Types.LoadedDb) => addTestingData(d.instance));

  const LINKS = [
    { label: "Database view", href: "/db" },
    { label: "Application prototype", href: "/app" },
    { label: "Config editor", href: "/config" },
  ];

  const getStatusIcon = (statusCode: Types.diagnostic) => {
    const STATUS_CODES = [
      { diagnostic: "INITIAL", icon: "🕑" },
      { diagnostic: "OK", icon: "🟢" },
      { diagnostic: "LOADING", icon: "🟡" },
      { diagnostic: "ERROR", icon: "🔴" },
    ];
    return STATUS_CODES.filter(({ diagnostic }) => diagnostic === statusCode)[0].icon;
  };

  return (
    <div className={clsx("flex-end bg-orange-100 min-h-screen p-2 ml-2", devPanelState ? "w-72" : "w-5")}>
      <button
        className={clsx("button-dev-panel-toggle", !devPanelState && "rotate-180")}
        onClick={() => setDevPanelState(!devPanelState)}
      >
        ▶
      </button>
      <div>
        {devPanelState && (
          <>
            <details open>
              <summary>
                <h2>🖥 Views</h2>
              </summary>
              <ul>
                {LINKS.map(({ href, label }, index) => (
                  <li key={index}>
                    <Link href={href}>
                      <a>{label}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
            <details open>
              <summary>
                <h2>⚒ Database Actions</h2>
              </summary>
              <button className="button--small" onClick={clearDbs}>
                clear the documents (all dbs)
              </button>
              <button className="button--small" onClick={addTestingDataDbs}>
                add testing data (all dbs)
              </button>
            </details>
            <details open>
              <summary>
                <h2>🚦 Status</h2>
              </summary>
              <h3>App</h3>
              <pre>{JSON.stringify(appState, null, 2)}</pre>
              <h3>Databases</h3>
              {dbs.map((d, index) => (
                <Fragment key={index}>
                  <span>{d.name} |</span>
                </Fragment>
              ))}
            </details>
          </>
        )}
      </div>
    </div>
  );
};

export default DevPanel;
