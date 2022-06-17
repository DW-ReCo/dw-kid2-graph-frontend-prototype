import * as cfgTypes from "@cfg/types";
import * as db from "@db/index";
import * as queries from "@db/queries";
import { generateTestingDocs1 } from "@db/testing_data";
import * as dbTypes from "@db/types";
import { LoadedDb } from "@db/types";
import AddBlock from "@frontend/containers/block/addBlock";
import Block from "@frontend/containers/block/index";
import React, { Fragment } from "react";
import { useRxQuery } from "rxdb-hooks";

const docs: dbTypes.DbDocument[] = generateTestingDocs1();

const AllBlocks = (props: { db: LoadedDb }) => {
  const { db } = props;
  const { result: docs } = useRxQuery(queries.allBlocks(db.instance));
  const blocks: dbTypes.Block[] = docs.map((d) => d.get());

  return (
    <>
      {blocks.map((block, index) => (
        <Fragment key={index}>
          <Block db={db} block={block} />
        </Fragment>
      ))}
    </>
  );
};

const BlockDev = () => {
  const [instance, setDb] = React.useState<LoadedDb>();

  React.useEffect(() => {
    const loader: cfgTypes.LocalDbConfig = { name: "local_testing_db", _type: "local_db_config" };
    // load the database if it's already not in the state,
    // protects against hot reloading
    instance ||
      db
        .initializeOne(loader)
        .then((d) => ({ ...loader, instance: d }))
        .then((d) => {
          db.upsertDocs(d.instance, docs);
          setDb(d);
        });
  }, []);

  return (
    <>
      <div style={{ width: "49%", float: "left" }}>
        {instance && <AllBlocks db={instance} />}
        {instance && <AddBlock db={instance} />}
      </div>

      <div style={{ width: "49%", float: "left", opacity: ".5" }}>
        <p>Test reactivity:</p>
        {instance && <AllBlocks db={instance} />} {/* twice to test reactivity */}
      </div>
    </>
  );
};

export default BlockDev;
