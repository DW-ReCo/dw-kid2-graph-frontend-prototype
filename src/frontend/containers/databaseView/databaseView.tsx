import React from "react";
import RenderData from "@frontend/components/databaseView/renderData";
import * as DatabaseTypes from "@data-types/index";
import * as Queries from "@db/queries";
import { RxQueryResultDoc, useRxQuery } from "rxdb-hooks";
import RenderDataWrapper from "@frontend/components/databaseView/renderData/wrapper";

const DBRenderer = (dbL: DatabaseTypes.LoadedDb) => {
  const { instance, name, description } = dbL;

  const { result: allBlocks }: RxQueryResultDoc<DatabaseTypes.Block> = useRxQuery(Queries.allBlocks(instance));
  const { result: allData }: RxQueryResultDoc<DatabaseTypes.Data> = useRxQuery(Queries.allData(instance));
  const { result: allExecutions }: RxQueryResultDoc<DatabaseTypes.Execution> = useRxQuery(
    Queries.allExecutions(instance),
  );
  const { result: allPages }: RxQueryResultDoc<DatabaseTypes.Page> = useRxQuery(Queries.allPages(instance));

  return (
    <div className="w-full">
      <h1>{name}</h1>
      <p>{description}</p>
      <RenderDataWrapper>
        <RenderData title="Blocks" documents={allBlocks} />
        <RenderData title="Data" documents={allData} />
        <RenderData title="Executions" documents={allExecutions} />
        <RenderData title="Pages" documents={allPages} />
      </RenderDataWrapper>
    </div>
  );
};

export default DBRenderer;
