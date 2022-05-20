import React, { useState, useEffect } from "react";
import { Provider } from "rxdb-hooks";
import { initialize } from "../../db";
import { subscribeQuery } from "../../utils/subscribeQuery";
import { RxDatabase } from "rxdb";
import { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  const [db, setDb] = useState<RxDatabase>();

  useEffect(() => {
    const initDB = async () => {
      const _db = await initialize();
      setDb(_db);

      // subscribe to a query and log Niko if name is Niko
      subscribeQuery(_db.characters.find().where({ name: { $eq: "Niko" } }), (res) => {
        res.length > 0 && console.log("Name ist Niko");
      });
    };
    if (window !== undefined) {
      initDB();
    }
  }, []);

  return (
    <Provider db={db}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
