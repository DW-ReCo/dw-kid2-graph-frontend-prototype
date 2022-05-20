import React, { useState, useEffect } from "react";
import { Provider } from "rxdb-hooks";
import { initialize } from "../../db";
import { subscribeQuery } from "../../utils/subscribeQuery";
import { RxDatabase } from "rxdb";
import { AppProps } from "next/app";
import * as cfg from "../../cfg";

const App = ({ Component, pageProps }: AppProps) => {
  const [config, setConfig] = useState<cfg.PartialConfig>();
  const [db, setDb] = useState<RxDatabase>();

  const initDB = async (c: cfg.PartialConfig) => {
    console.log(`[app] using config`, c);
    const { dbs: dbLoaders } = c;
    console.log(`[app] initializing dbs`, dbLoaders);
    console.log(`[app] for now, only using`, dbLoaders[0]);
    const dbLoader = dbLoaders[0];
    const _db = await initialize(dbLoader);
    console.log(`[app] got db`, _db);
    setDb(_db);

    // subscribe to a query and log Niko if name is Niko
    subscribeQuery(_db.characters.find().where({ name: { $eq: "Niko" } }), (res) => {
      res.length > 0 && console.log("Name ist Niko");
    });
  };

  useEffect(() => {
    const initConfig = async () => {
      const c = await cfg.load();
      console.log(`[app] loaded config`, c);
      setConfig(c);
      return c;
    }

    if (window !== undefined) {
      initConfig().then(c => initDB(c))
    }
  }, []);

  // FIXME dirty hack
  if (!db) return <></>;

  return (
    <Provider db={db}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
