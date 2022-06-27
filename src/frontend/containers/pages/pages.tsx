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
      document__id: id,
      document__type: Types.DocumentType.Page,
      page__title: `Page ${id}`,
      page__blocks: [],
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
    <div className="ml-2 mt-2 mb-6">
      <h2>📓 {db.description}</h2>

      <div className="ml-4 my-2">
        <div className="flex gap-2">
          <h3>📑 Pages</h3>
          <button className="m-0 p-1" onClick={addNewPage}>
            + page
          </button>
        </div>
        <ul className="ml-3 flex gap-2 flex-wrap">{pages(allPages)}</ul>
      </div>
    </div>
  );
};

export default Pages;
