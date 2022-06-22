import React, { useState, useEffect } from "react";
import * as Database from "@db/index";
import { AppProps } from "next/app";
import * as Config from "src/config/index";
import { Provider as AppContextProvider } from "@frontend/hooks/contexts/useAppContext";
import { Provider as ConfigContextProvider } from "@frontend/hooks/contexts/useConfigContext";
import { Provider as DbContextProvider } from "@frontend/hooks/contexts/useDbContext";

import { default as appContextInitialState } from "@frontend/hooks/contexts/useAppContext/initialState";
import { default as dbContextInitialState } from "@frontend/hooks/contexts/useDbContext/initialState";
import { default as configContextInitialState } from "@frontend/hooks/contexts/useConfigContext/initialState";

import "@frontend/styles/globals.css";

import DevPanel from "./dev/panel";

import * as Logger from "@logger/index";

const log = Logger.makeLogger("frontend/pages/_app");

const App = ({ Component, pageProps }: AppProps) => {
  const [appState, setAppState] = useState(
    typeof window !== "undefined" && localStorage.getItem("kid2-appState")
      ? JSON.parse(localStorage.getItem("kid2-appState") || "{}")
      : appContextInitialState,
  );
  const [dbState, setDbState] = useState(dbContextInitialState);
  const [configState, setConfigState] = useState(configContextInitialState);

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

    const stringifiedState = JSON.stringify(appState, getCircularReplacer());
    localStorage.setItem("kid2-appState", stringifiedState);
  }, [appState]);

  const loadConfig = async () => {
    const c = await Config.load();
    log.debug(`loaded config`, c);
    setConfigState(c);
  };

  const loadDbs = async () => {
    if (!configState) {
      log.error(`no config found!`);
      return;
    }
    if (!configState.dbs) {
      log.error(`no databases configured`);
      return;
    }
    const { dbs: loaders } = configState;
    log.debug(`initializing dbs`, loaders);
    const dbs = await Database.initializeAll(loaders);
    setDbState(dbs);
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
      configState?.dbs && loadDbs();
    }
  }, [configState]);

  return (
    <>
      {Database && (
        <AppContextProvider value={{ appState, setAppState }}>
          <ConfigContextProvider value={{ configState, setConfigState }}>
            <DbContextProvider value={{ dbState, setDbState }}>
              <DevPanel />
              <Component {...pageProps} />
            </DbContextProvider>
          </ConfigContextProvider>
        </AppContextProvider>
      )}
    </>
  );
};

export default App;
