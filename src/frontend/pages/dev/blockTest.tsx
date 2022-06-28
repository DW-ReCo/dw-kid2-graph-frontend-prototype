import React, { Fragment } from "react";
import Block from "@frontend/containers/block/index";
import AddBlock from "@frontend/containers/block/addBlock";
import { generateTestingDocs1 } from "@db/testing_data";
import * as Types from "@data-types/index";
import * as Database from "@db/index";
import * as Queries from "@db/queries";
import { useRxQuery } from "rxdb-hooks";

const docs: Types.Document[] = generateTestingDocs1();

const AllBlocks = (props: { db: Types.LoadedDb }) => {
  const { db } = props;
  const { result: docs } = useRxQuery(Queries.allBlocks(db.instance));
  const blocks: Types.Block[] = docs.map((d) => d.get()) as Types.Block[];

  return (
    <>
      {blocks.map((block, index) => (
        <Fragment key={index}></Fragment>
      ))}
    </>
  );
};

const BlockDev = () => {
  const [instance, setDb] = React.useState<Types.LoadedDb>();

  React.useEffect(() => {
    const loader: Types.LocalDbConfig = { name: "local_testing_db", _type: "local_db_config" };
    // load the database if it's already not in the state,
    // protects against hot reloading
    instance ||
      Database.initializeOne(loader).then((d) => {
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
