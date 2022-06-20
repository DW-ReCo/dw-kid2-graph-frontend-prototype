import React, { useState, useEffect } from "react";
import * as db from "@db/index";
import { AppProps } from "next/app";
import * as cfg from "@cfg/index";
import { Provider as AppStoreProvider } from "@frontend/store/index";

import "@frontend/styles/globals.css";

import DevPanel from "./components/devPanel";

import * as Logger from "@logger/index";
import initialState from "@frontend/store/initialState";

const log = Logger.makeLogger("frontent/pages/_app");

const App = ({ Component, pageProps }: AppProps) => {
  const [state, setState] = useState(initialState);
  const { config } = state;

  const loadConfig = async () => {
    const c = await cfg.load();
    log.debug(`loaded config`, c);
    setState((prev) => ({ ...prev, config: c }));
  };

  const loadDbs = async () => {
    if (!config) {
      log.error(`no config found!`);
      return;
    }
    if (!config.dbs) {
      log.error(`no databases configured`);
      return;
    }
    const { dbs: loaders } = config;
    log.debug(`initializing dbs`, loaders);
    const dbs = await db.initializeAll(loaders);
    setState((prev) => ({ ...prev, dbs: dbs }));
  };

  // onLoad - when the application loads, load the config
  useEffect(() => {
    // only do any of this in the browser:
    if (window !== undefined) {
      loadConfig();
    }
  }, []);

  // onConfig - when we get new config, load the dbs
  useEffect(() => {
    // only do any of this in the browser:
    if (window !== undefined) {
      loadDbs();
    }
  }, [config]);

  return (
    <>
      {db && (
        <AppStoreProvider value={{ state, setState }}>
          <DevPanel />
          <Component {...pageProps} />
        </AppStoreProvider>
      )}
    </>
  );
};

export default App;
