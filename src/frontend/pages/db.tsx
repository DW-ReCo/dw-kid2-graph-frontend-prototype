import React from "react";
import { RxCollection } from "rxdb";
import { useRxData, RxQueryResultDoc } from "rxdb-hooks";
import * as dbTypes from "../../db/types";

const DbPage = () => {
  const queryConstructor = (collection: RxCollection) => collection.find();

  const { result: allBlocks }: RxQueryResultDoc<dbTypes.Page> = useRxData("blocks", queryConstructor);
  const { result: allResults }: RxQueryResultDoc<dbTypes.Page> = useRxData("results", queryConstructor);
  const { result: allExecutions }: RxQueryResultDoc<dbTypes.Page> = useRxData("executions", queryConstructor);
  const { result: allLinks }: RxQueryResultDoc<dbTypes.Page> = useRxData("links", queryConstructor);
  const { result: allPages }: RxQueryResultDoc<dbTypes.Page> = useRxData("pages", queryConstructor);

  const RenderData = ({ documents, title }) => (
    <>
      <h2>{title}</h2>
      <ul>
        {documents.map((document, index) => (
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
      <RenderData title="Data" documents={allResults} />
      <RenderData title="Executions" documents={allExecutions} />
      <RenderData title="Links" documents={allLinks} />
      <RenderData title="Pages" documents={allPages} />
    </div>
  );
};

export default DbPage;
