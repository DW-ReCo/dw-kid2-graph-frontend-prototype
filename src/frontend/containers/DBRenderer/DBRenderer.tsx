import * as queries from "@db/queries";
import * as dbTypes from "@db/types";
import RenderData from "@frontend/components/renderData";
import React from "react";
import { RxQueryResultDoc, useRxQuery } from "rxdb-hooks";

const DBRenderer = (dbL: dbTypes.LoadedDb) => {
  const { instance, name, description } = dbL;

  const { result: allBlocks }: RxQueryResultDoc<dbTypes.Block> = useRxQuery(queries.allBlocks(instance));
  const { result: allData }: RxQueryResultDoc<dbTypes.Data> = useRxQuery(queries.allData(instance));
  const { result: allExecutions }: RxQueryResultDoc<dbTypes.Execution> = useRxQuery(queries.allExecutions(instance));
  const { result: allPages }: RxQueryResultDoc<dbTypes.Page> = useRxQuery(queries.allPages(instance));

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
