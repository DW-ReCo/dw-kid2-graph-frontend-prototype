import React from "react";
import { useRxQuery } from "rxdb-hooks";
import * as dbTypes from "../../../db/types";
import * as queries from "../../../db/queries";
import PageListItem from "../../components/pageListItem";

const Pages = (props: { dbL: dbTypes.LoadedDb; open: (p: dbTypes.Page) => void }) => {
  const { dbL, open } = props;

  const { result: allDocs } = useRxQuery(queries.allPages(dbL.db));
  // something like this will have to be run after every query:
  // this gets out the data, that can be passed to react.  you can also call remove, etc
  // on these RxDocumentConstructors, so it might be helpful to keep them that way for longer
  const allPages: dbTypes.Page[] = allDocs.map((d) => d.get());
  const pages = (ps) => ps.map((p) => <PageListItem page={p} open={() => open(p)} />);

  return (
    <div>
      <h3>{dbL.name}</h3>
      <p>{dbL.description}</p>
      {pages(allPages)}
    </div>
  );
};

export default Pages;
