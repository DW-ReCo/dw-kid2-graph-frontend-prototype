import React from "react";
import RenderData from "@frontend/components/renderData";
import * as dbTypes from "@db/types";
import * as queries from "@db/queries";
import { RxQueryResultDoc, useRxQuery } from "rxdb-hooks";

const DBRenderer = (dbL: dbTypes.LoadedDb) => {
  const { instance, name, description } = dbL;

  const { result: allBlocks }: RxQueryResultDoc<dbTypes.Block> = useRxQuery(queries.allBlocks(instance));
  const { result: allData }: RxQueryResultDoc<dbTypes.Data> = useRxQuery(queries.allData(instance));
  const { result: allExecutions }: RxQueryResultDoc<dbTypes.Execution> = useRxQuery(queries.allExecutions(instance));
  const { result: allPages }: RxQueryResultDoc<dbTypes.Page> = useRxQuery(queries.allPages(instance));

  return (
    <div className="w-full">
      <h1>{name}</h1>
      <p>{description}</p>
      <div className="flex flex-row gap-2 content-evenly">
        <RenderData title="Blocks" documents={allBlocks} />
        <RenderData title="Data" documents={allData} />
        <RenderData title="Executions" documents={allExecutions} />
        <RenderData title="Pages" documents={allPages} />
      </div>
    </div>
  );
};

export default DBRenderer;
