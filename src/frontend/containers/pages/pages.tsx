import React, { Fragment } from "react";
import { useRxQuery } from "rxdb-hooks";
import * as dbTypes from "@db/types";
import * as queries from "@db/queries";
import PageListItem from "@frontend/components/pageListItem";
import { uniqueId } from "@frontend/utils";

const Pages = (props: { db: dbTypes.LoadedDb; open: (p: dbTypes.Page) => void }) => {
  const { db, open } = props;

  const { result: allDocs } = useRxQuery(queries.allPages(db.instance));
  // something like this will have to be run after every query:
  // this gets out the data, that can be passed to react.  you can also call remove, etc
  // on these RxDocumentConstructors, so it might be helpful to keep them that way for longer
  const allPages: dbTypes.Page[] = allDocs.map((d) => d.get());

  const addNewPage = () => {
    const id = uniqueId();
    const newPage: dbTypes.Page = {
      id: id,
      document_type: dbTypes.DbDocumentType.Page,
      title: `Page ${id}`,
      blocks: [],
    };

    queries.upsertOne(db.instance, newPage);
  };
  const pages = (ps: dbTypes.Page[]) =>
    ps.map((p, index) => (
      <Fragment key={index}>
        <PageListItem db={db} page={p} open={() => open(p)} />
      </Fragment>
    ));

  return (
    <div>
      <h3>{db.name}</h3>
      <p>{db.description}</p>
      {pages(allPages)}
      <button onClick={addNewPage}>+</button>
    </div>
  );
};

export default Pages;
