import React, { useState, useEffect } from "react";
import * as db from "@db/index"
import * as dbTypes from "@db/types";
import { AppProps } from "next/app";
import * as cfg from "@cfg/index";

import "../styles/globals.css";

import { DbsContext } from "./_context";

import DevPanel from "./components/devPanel";

import * as Logger from "@logger/index";

const log = Logger.makeLogger("frontent/pages/_app");

const App = ({ Component, pageProps }: AppProps) => {
  const [config, setConfig] = useState<cfg.PartialConfig>();
  const [dbs, setDbs] = useState<dbTypes.LoadedDb[]>([]);

  const loadConfig = async () => {
    const c = await cfg.load();
    log.debug(`loaded config`, c);
    setConfig(c);
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
    setDbs(dbs);
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
        <DbsContext.Provider value={dbs}>
          <DevPanel />
          <Component {...pageProps} />
        </DbsContext.Provider>
      )}
    </>
  );
};

export default App;
