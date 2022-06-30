import { RxQueryResultDoc, useRxQuery } from "rxdb-hooks";

import React from "react";

import * as Types from "@data-types/index";

import * as Queries from "@database/queries";

import RenderData from "@frontend/components/databaseView/renderData";
import RenderDataWrapper from "@frontend/components/databaseView/renderData/wrapper";

const DBRenderer = (dbL: Types.Database.LoadedDatabase) => {
  const { instance, name, description } = dbL;

  const { result: allBlocks }: RxQueryResultDoc<Types.Block.Block> = useRxQuery(Queries.allBlocks(instance));
  const { result: allData }: RxQueryResultDoc<Types.Data.Data> = useRxQuery(Queries.allData(instance));
  const { result: AllRecords }: RxQueryResultDoc<Types.Record.Record> = useRxQuery(Queries.AllRecords(instance));
  const { result: allPages }: RxQueryResultDoc<Types.Page.Page> = useRxQuery(Queries.allPages(instance));

  return (
    <div className="w-full">
      <h1>{name}</h1>
      <p>{description}</p>
      <RenderDataWrapper>
        <RenderData title="Blocks" documents={allBlocks} />
        <RenderData title="Data" documents={allData} />
        <RenderData title="Execution Records" documents={AllRecords} />
        <RenderData title="Pages" documents={allPages} />
      </RenderDataWrapper>
    </div>
  );
};

export default DBRenderer;
