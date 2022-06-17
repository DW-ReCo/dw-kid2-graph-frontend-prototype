import React from "react";
import RenderData from "@frontend/components/renderData";
import * as dbTypes from "@db/types";
import * as queries from "@db/queries";
import { RxQueryResultDoc, useRxQuery } from "rxdb-hooks";

const DBRenderer = (dbL: dbTypes.LoadedDb) => {
  const { db, name, description } = dbL;

  const { result: allBlocks }: RxQueryResultDoc<dbTypes.Block> = useRxQuery(queries.allBlocks(db));
  const { result: allData }: RxQueryResultDoc<dbTypes.Data> = useRxQuery(queries.allData(db));
  const { result: allExecutions }: RxQueryResultDoc<dbTypes.Execution> = useRxQuery(queries.allExecutions(db));
  const { result: allPages }: RxQueryResultDoc<dbTypes.Page> = useRxQuery(queries.allPages(db));

  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
      <RenderData title="Blocks" documents={allBlocks} />
      <RenderData title="Data" documents={allData} />
      <RenderData title="Executions" documents={allExecutions} />
      <RenderData title="Pages" documents={allPages} />
    </div>
  );
};

export default DBRenderer;
