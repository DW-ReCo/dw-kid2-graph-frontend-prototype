import React, { Fragment } from "react";
import { useRxQuery } from "rxdb-hooks";
import * as Types from "@data-types/index";
import * as Queries from "@db/queries";
import PageListItem from "@frontend/components/pageListItem";
import { uniqueId } from "@frontend/utils";

const Pages = (props: { db: Types.LoadedDb; open: (p: Types.Page) => void }) => {
  const { db, open } = props;

  const { result: allDocs } = useRxQuery(Queries.allPages(db.instance));
  // something like this will have to be run after every query:
  // this gets out the data, that can be passed to react.  you can also call remove, etc
  // on these RxDocumentConstructors, so it might be helpful to keep them that way for longer
  const allPages: Types.Page[] = allDocs.map((d) => d.get());

  const addNewPage = () => {
    const id = uniqueId();
    const newPage: Types.Page = {
      "document/id": id,
      "document/type": Types.DbDocumentType.Page,
      "page/title": `Page ${id}`,
      "page/blocks": [],
    };

    Queries.upsertOne(db.instance, newPage);
  };
  const pages = (ps: Types.Page[]) =>
    ps.map((p, index) => (
      <Fragment key={index}>
        <PageListItem db={db} page={p} open={() => open(p)} />
      </Fragment>
    ));

  return (
    <div>
      <h3>{db.name}</h3>
      <p>{db.description}</p>
      <ul>
        {pages(allPages)}
        <li>
          <button onClick={addNewPage}>+ page</button>
        </li>
      </ul>
    </div>
  );
};

export default Pages;
