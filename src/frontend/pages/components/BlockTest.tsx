import React from "react";

import Block from "../../../frontend/containers/block/index";
import { generateTestingDocs1 } from "../../../db/testing_data";
import * as dbTypes from "../../../db/types";
import * as cfgTypes from "../../../cfg/types";
import * as db from "../../../db";
import * as queries from "../../../db/queries";
import { LoadedDb } from "../../../db/types";
import { useRxQuery } from "rxdb-hooks";

const docs: dbTypes.DbDocument[] = generateTestingDocs1();

const AllBlocks = (props: {db: LoadedDb}) => {
  const { db } = props;
  const { result: docs } = useRxQuery(queries.allBlocks(db.db));
  const blocks: dbTypes.Block[] = docs.map((d) => d.get());

  return (
    <>
      {blocks.map(block => <Block db={db} block={block} /> )}
    </>
  );
};

const BlockDev = () => {
  const [instance, setDb] = React.useState<LoadedDb>();

  React.useEffect(() => {
    const loader: cfgTypes.LocalDbConfig = { name: "local_testing_db", _type: "local_db_config" };
    // load the database if it's already not in the state,
    // protects against hot reloading
    instance || db.initializeOne(loader)
                  .then(d => ({ ...loader, db: d }))
                  .then(d => {
                    db.upsertDocs(d.db, docs);
                    setDb(d);
                  });
  }, []);

  return (
    <>
      {instance && <AllBlocks db={instance} />}
      <hr />
      {instance && <AllBlocks db={instance} />} {/* twice to test reactivity */}
    </>
  )
}

export default BlockDev;
