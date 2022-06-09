import React from "react";
import { RxCollection } from "rxdb";
import { useRxData, RxQueryResultDoc } from "rxdb-hooks";
import * as dbTypes from "../../db/types";

const DbPage = () => {
  const queryConstructor = (collection: RxCollection) => collection.find();

  const { result: allBlocks }: RxQueryResultDoc<dbTypes.Page> = useRxData("blocks", queryConstructor);
  const { result: allData }: RxQueryResultDoc<dbTypes.Data> = useRxData("data", queryConstructor);
  const { result: allExecutions }: RxQueryResultDoc<dbTypes.Execution> = useRxData("executions", queryConstructor);
  const { result: allLinks }: RxQueryResultDoc<dbTypes.DataLink> = useRxData("links", queryConstructor);
  const { result: allPages }: RxQueryResultDoc<dbTypes.Page> = useRxData("pages", queryConstructor);

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
      <RenderData title="Links" documents={allLinks} />
      <RenderData title="Pages" documents={allPages} />
    </div>
  );
};

export default DbPage;
