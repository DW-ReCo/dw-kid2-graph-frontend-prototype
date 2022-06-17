import React from "react";
import * as dbTypes from "@db/types";
import * as queries from "@db/queries";
import { useRxQuery } from "rxdb-hooks";
import PageBlocks from "@frontend/containers/pageBlocks";

const Page = (props: { db: dbTypes.LoadedDb; pageID: string }) => {
  const { pageID, db } = props;

  const { result: doc } = useRxQuery(queries.page(db.instance, pageID));
  const page: dbTypes.Page = doc[0]?.get();

  if (!page) {
    return <h4>Page Not Found</h4>;
  }

  return (
    <>
      <h1>{page.title}</h1>
      <PageBlocks db={db} page={page} />
    </>
  );
};

export default Page;
