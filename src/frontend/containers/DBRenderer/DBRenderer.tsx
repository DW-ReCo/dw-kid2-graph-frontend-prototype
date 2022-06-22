import React from "react";
import RenderData from "@frontend/components/renderData";
import * as DatabaseTypes from "@db/types";
import * as Queries from "@db/queries";
import { RxQueryResultDoc, useRxQuery } from "rxdb-hooks";

const DBRenderer = (dbL: DatabaseTypes.LoadedDb) => {
  const { instance, name, description } = dbL;

  const { result: allBlocks }: RxQueryResultDoc<DatabaseTypes.Block> = useRxQuery(Queries.allBlocks(instance));
  const { result: allData }: RxQueryResultDoc<DatabaseTypes.Data> = useRxQuery(Queries.allData(instance));
  const { result: allExecutions }: RxQueryResultDoc<DatabaseTypes.Execution> = useRxQuery(
    Queries.allExecutions(instance),
  );
  const { result: allPages }: RxQueryResultDoc<DatabaseTypes.Page> = useRxQuery(Queries.allPages(instance));

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
