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

import RenderStatus from "@frontend/components/devPanel/renderStatus";
import useStatus from "@frontend/hooks/useStatus";
import useConfigContext from "@frontend/hooks/contexts/useConfigContext";

const DevPanel = () => {
  // @ts-ignore
  const { dbState: dbs } = useDbContext();

  const {
    // @ts-ignore
    appState: {
      // @ts-ignore
      app: { activeDatabase, activePage, showDevPanel },
    },
    // @ts-ignore
    setAppState,
  } = useAppContext();

  const status = useStatus();

  const firstDb = first(dbs);

  if (!firstDb) return <></>;

  const clearDbs = () => dbs.map((d: Types.LoadedDb) => Database.clearDocs(d.instance));

  const addTestingDataDbs = () => dbs.map((d: Types.LoadedDb) => addTestingData(d.instance));

  const LINKS = [
    { label: "Database view", href: "/db" },
    { label: "Application prototype", href: "/app" },
    { label: "Config editor", href: "/config" },
  ];

  return (
    <div
      className={clsx(
        "flex-end bg-orange-100 min-h-screen p-2 ml-2 sticky max-h-screen top-0 right-0",
        showDevPanel ? "w-72" : "w-5",
      )}
    >
      <button
        className={clsx("button-dev-panel-toggle", !showDevPanel && "rotate-180")}
        onClick={() => setAppState((prev) => ({ ...prev, app: { ...prev.app, showDevPanel: !showDevPanel } }))}
      >
        ▶
      </button>
      <div>
        {showDevPanel && (
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
              <RenderStatus status={status.app.status} />
              <h3>Config</h3>
              <RenderStatus status={status.config.status} />
              <h3>Databases</h3>
              <RenderStatus status={status.db.status} />

              <p>active Database: {activeDatabase}</p>
              <p>active Page: {activePage}</p>
              <p>loaded Databases:</p>
              <ul>
                {dbs.map((d, index) => (
                  <li key={index}>{d.name}</li>
                ))}
              </ul>
            </details>
          </>
        )}
      </div>
    </div>
  );
};

export default DevPanel;
