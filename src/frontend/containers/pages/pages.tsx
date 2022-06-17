import React, { Fragment } from "react";
import * as queries from "@db/queries";
import * as dbTypes from "@db/types";
import PageListItem from "@frontend/components/pageListItem";
import { useRxQuery } from "rxdb-hooks";

const Pages = (props: { db: dbTypes.LoadedDb; open: (p: dbTypes.Page) => void }) => {
  const { db, open } = props;

  const { result: allDocs } = useRxQuery(queries.allPages(db.instance));
  // something like this will have to be run after every query:
  // this gets out the data, that can be passed to react.  you can also call remove, etc
  // on these RxDocumentConstructors, so it might be helpful to keep them that way for longer
  const allPages: dbTypes.Page[] = allDocs.map((d) => d.get());
  const pages = (ps: dbTypes.Page[]) =>
    ps.map((p, index) => (
      <Fragment key={index}>
        <PageListItem page={p} open={() => open(p)} />
      </Fragment>
    ));

  return (
    <div>
      <h3>{db.name}</h3>
      <p>{db.description}</p>
      {pages(allPages)}
    </div>
  );
};

export default Pages;
