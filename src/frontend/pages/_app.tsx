import React, { useState, useEffect } from "react";
import { Provider } from "rxdb-hooks";
import { initialize, addTestingData, clearAllCollections } from "../../db";
import { RxDatabase } from "rxdb";
import { AppProps } from "next/app";
import * as cfg from "../../cfg";

const App = ({ Component, pageProps }: AppProps) => {
  const [config, setConfig] = useState<cfg.PartialConfig>();
  const [ready, setReady] = useState(false);
  const [db, setDb] = useState<RxDatabase>();

  const initDB = async (c: cfg.PartialConfig) => {
    console.log(`[app] using config`, c);
    const { dbs: dbLoaders } = c;
    console.log(`[app] initializing dbs`, dbLoaders);
    if (!dbLoaders[0]) {
      console.log("No db defined");
      return;
    }
    console.log(`[app] for now, only using`, dbLoaders[0]);
    const dbLoader = dbLoaders[0];
    const _db = await initialize(dbLoader);
    console.log(`[app] got db`, _db);
    setDb(_db);
    return _db;
  };

  useEffect(() => {
    const initConfig = async () => {
      const c = await cfg.load();
      console.log(`[app] loaded config`, c);
      setConfig(c);
      return c;
    };

    if (window !== undefined) {
      initConfig()
        .then((c) => initDB(c))
        // .then((db) => clearAllCollections(db))
        .then((d) => addTestingData(d))
        .then(() => setReady(true));
    }
  }, []);

  return (
    <>
      {db && ready && (
        <Provider db={db}>
          <Component {...pageProps} />
        </Provider>
      )}
    </>
  );
};

export default App;
