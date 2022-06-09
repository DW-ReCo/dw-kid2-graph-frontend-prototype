import React from "react";
import { RxCollection } from "rxdb";
import { useRxData, RxQueryResultDoc, useRxQuery, useRxDB } from "rxdb-hooks";
import * as dbTypes from "../../db/types";
import * as queries from "../../db/queries";

const DbPage = () => {
  // @ts-ignore
  const db: RxDatabase = useRxDB();

  const { result: allBlocks }: RxQueryResultDoc<dbTypes.Block> = useRxQuery(queries.allBlocks(db));
  const { result: allData }: RxQueryResultDoc<dbTypes.Data> = useRxQuery(queries.allData(db));
  const { result: allExecutions }: RxQueryResultDoc<dbTypes.Execution> = useRxQuery(queries.allExecutions(db));
  const { result: allPages }: RxQueryResultDoc<dbTypes.Page> = useRxQuery(queries.allPages(db));

  interface RenderDataPropTypes {
    documents: Array<object>;
    title: string
  }

  const RenderData = ({ documents, title }: RenderDataPropTypes) => (
    <>
      <h2>{title}</h2>
      <ul>
        {documents.map((document: object, index: number) => (
          <li key={index}>
            <pre>{JSON.stringify(document, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div>
      <RenderData title="Blocks" documents={allBlocks} />
      <RenderData title="Data" documents={allData} />
      <RenderData title="Executions" documents={allExecutions} />
      <RenderData title="Pages" documents={allPages} />
    </div>
  );
};

export default DbPage;
