import React, { Fragment } from "react";
import AddBlock from "@frontend/containers/block/addBlock";
import { generateTestingDocs1 } from "@database/testing_data";
import * as Types from "@data-types/index";
import * as Database from "@database/index";
import * as Queries from "@database/queries";
import { useRxQuery } from "rxdb-hooks";

const docs: Types.Document.Prototype[] = generateTestingDocs1();

const AllBlocks = (props: { db: Types.Database.LoadedDb }) => {
  const { db } = props;
  const { result: docs } = useRxQuery(Queries.allBlocks(db.instance));
  const blocks: Types.Block.Block[] = docs.map((d) => d.get()) as Types.Block.Block[];

  return (
    <>
      {blocks.map((block, index) => (
        <Fragment key={index}></Fragment>
      ))}
    </>
  );
};

const BlockDev = () => {
  const [instance, setDb] = React.useState<Types.Database.LoadedDb>();

  React.useEffect(() => {
    const loader: Types.Config.LocalDatabaseConfig = { name: "local_testing_db", _type: "local_db_config" };
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
