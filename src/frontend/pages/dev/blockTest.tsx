import React, { Fragment } from "react";
import Block from "@frontend/containers/block/index";
import AddBlock from "@frontend/containers/block/addBlock";
import { generateTestingDocs1 } from "@db/testing_data";
import * as DatabaseTypes from "@db/types";
import * as ConfigTypes from "@config/types";
import * as Database from "@db/index";
import * as Queries from "@db/queries";
import { LoadedDb } from "@db/types";
import { useRxQuery } from "rxdb-hooks";

const docs: DatabaseTypes.DbDocument[] = generateTestingDocs1();

const AllBlocks = (props: { db: LoadedDb }) => {
  const { db } = props;
  const { result: docs } = useRxQuery(Queries.allBlocks(db.instance));
  const blocks: DatabaseTypes.Block[] = docs.map((d) => d.get()) as DatabaseTypes.Block[];

  return (
    <>
      {blocks.map((block, index) => (
        <Fragment key={index}></Fragment>
      ))}
    </>
  );
};

const BlockDev = () => {
  const [instance, setDb] = React.useState<LoadedDb>();

  React.useEffect(() => {
    const loader: ConfigTypes.LocalDbConfig = { name: "local_testing_db", _type: "local_db_config" };
    // load the database if it's already not in the state,
    // protects against hot reloading
    instance ||
      Database.initializeOne(loader)
        .then((d) => ({ ...loader, instance: d }))
        .then((d) => {
          Database.upsertDocs(d.instance, docs);
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
