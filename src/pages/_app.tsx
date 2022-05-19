import React, { useState, useEffect } from "react";
import { Provider } from "rxdb-hooks";
import { initialize } from "../../db";
import { subscribeQuery } from "../../utils/subscribeQuery";

const App = ({ Component, pageProps }) => {
  const [db, setDb] = useState();

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
