import React, { useState, useEffect } from "react";
import * as db from "@db/index";
import { AppProps } from "next/app";
import * as cfg from "@cfg/index";
import { Provider as AppStoreProvider } from "@frontend/store/index";

import "@frontend/styles/globals.css";

import DevPanel from "./dev/panel";

import * as Logger from "@logger/index";
import initialState from "@frontend/store/initialState";

const log = Logger.makeLogger("frontent/pages/_app");

const App = ({ Component, pageProps }: AppProps) => {
  const [state, setState] = useState(
    typeof window !== "undefined" && localStorage.getItem("kid2-state")
      ? JSON.parse(localStorage.getItem("kid2-state"))
      : initialState,
  );

  const { config } = state;

  useEffect(() => {
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (_key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };

    const stringifiedState = JSON.stringify(state, getCircularReplacer());
    localStorage.setItem("kid2-state", stringifiedState);
  }, [state]);

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
  }, [state.config]);

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
