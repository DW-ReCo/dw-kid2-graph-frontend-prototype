// eslint-disable @typescript-eslint/no-unused-vars
import clsx from "clsx";
import { first } from "lodash/fp";
import Link from "next/link";

import React from "react";

import * as Types from "@data-types/index";

import * as Database from "@database/index";
import { addTestingData } from "@database/testing_data";

import RenderStatus from "@frontend/components/devPanel/renderStatus";
import useAppContext from "@frontend/hooks/contexts/useAppContext";
import useConfigContext from "@frontend/hooks/contexts/useConfigContext";
import useDatabaseContext from "@frontend/hooks/contexts/useDatabaseContext";
import useStatus from "@frontend/hooks/useStatus";
import { useObservable } from "@frontend/utils";

import services from "@services/index";

import { getStatusIcon } from "@utils/index";

const ServiceStatus = (props: {
  db: Types.Database.LoadedDatabase;
  config: Types.Config.PartialConfig;
  service: Types.Service.Service;
}) => {
  const { service, db, config } = props;

  const isAvailable = useObservable(service.isAvailable(db.instance, config));

  return (
    <div className="flex">
      <span className="mr-2">{isAvailable ? getStatusIcon("OK") : getStatusIcon("ERROR")}</span>
      <span>{service.name}</span>
    </div>
  );
};

const DevPanel = () => {
  // @ts-ignore
  const { dbState: dbs } = useDatabaseContext();

  const {
    // @ts-ignore could be undefined FIXME
    appState: {
      // @ts-ignore
      app: { activeDatabase, activePage, showDevPanel },
    },
    // @ts-ignore could be undefined FIXME
    setAppState,
  } = useAppContext();

  // @ts-ignore could be undefined FIXME
  const { setConfigState, configState } = useConfigContext();

  const status = useStatus();

  const firstDb = first(dbs);

  if (!firstDb) return <></>;

  const clearDbs = () => dbs.map((d: Types.Database.LoadedDatabase) => Database.clearDocs(d.instance));

  const addTestingDataDbs = () => dbs.map((d: Types.Database.LoadedDatabase) => addTestingData(d.instance));

  const LINKS = [
    { label: "Database view", href: "/db" },
    { label: "Application prototype", href: "/app" },
    { label: "Config editor", href: "/config" },
  ];

  return (
    <>
      <div className="flex-end">
        <button
          className={clsx("button-dev-panel-toggle z-10", !showDevPanel && "rotate-180")}
          onClick={() => setAppState((prev) => ({ ...prev, app: { ...prev.app, showDevPanel: !showDevPanel } }))}
        >
          ▶
        </button>
        <div
          className={clsx(
            "bg-orange-100 min-h-screen p-2 ml-2 sticky max-h-screen top-0 right-0 overflow-y-scroll",
            showDevPanel ? "w-72" : "w-5",
          )}
        >
          <div className="">
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

                  <div className="flex flex-col my-2">
                    <label className="uppercase text-xs font-bold text-slate-600">active Database</label>
                    <span className="pl-2">{activeDatabase}</span>
                  </div>
                  <div className="flex flex-col mb-2">
                    <label className="uppercase text-xs font-bold text-slate-600">active Page</label>
                    <span className="pl-2">{activePage}</span>
                  </div>
                  <div className="flex flex-col mb-2">
                    <label className="uppercase text-xs font-bold text-slate-600">loaded Databases</label>
                    <ul className="pl-2">
                      {dbs.map((d, index) => (
                        <li key={index}>{d.name}</li>
                      ))}
                    </ul>
                  </div>
                </details>
                <details open>
                  {dbs.map((d) => (
                    <div key={d.name}>
                      <label className="uppercase text-xs font-bold text-slate-600 my-2">{d.name}</label>
                      {services.map((s) => (
                        <ServiceStatus key={s.name} db={d} config={configState} service={s} />
                      ))}
                    </div>
                  ))}
                </details>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DevPanel;
