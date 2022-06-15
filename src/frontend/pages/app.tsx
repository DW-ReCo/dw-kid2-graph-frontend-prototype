import React from "react";
import { RxQueryResultDoc, useRxQuery, useRxDB } from "rxdb-hooks";
import * as dbTypes from "../../db/types";
import * as queries from "../../db/queries";
import { DbsContext } from "./_context";

const Block = (props: { db: dbTypes.LoadedDb; block: dbTypes.Block }) => {
  const { db, block } = props;

  return (
    <>
      <h2>{block.document_type}</h2>
      <h3>{block.id}</h3>
    </>
  );
};

const PageBlocks = (props: { db: dbTypes.LoadedDb; page: dbTypes.Page }) => {
  const { page: p, db } = props;

  const { result: docs } = useRxQuery(queries.pageBlocks(db.db, p));
  const blocks: dbTypes.Block[] = docs.map((d) => d.get());

  return (
    <>
      {blocks.map((b) => (
        <Block db={db} block={b} />
      ))}
    </>
  );
};

const Page = (props: { db: dbTypes.LoadedDb; page: dbTypes.Page }) => {
  const { page: p, db } = props;

  const { result: doc } = useRxQuery(queries.page(db.db, p.id));
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

const PageListItem = (dbL: dbTypes.LoadedDb, page: dbTypes.Page, open: () => void) => {
  return (
    <div>
      {page.title}
      <button onClick={open}>Open</button>
    </div>
  );
};

const Pages = (props: { dbL: dbTypes.LoadedDb; open: (p: dbTypes.Page) => void }) => {
  const { dbL, open } = props;

  const { result: allDocs } = useRxQuery(queries.allPages(dbL.db));
  // something like this will have to be run after every query:
  // this gets out the data, that can be passed to react.  you can also call remove, etc
  // on these RxDocumentConstructors, so it might be helpful to keep them that way for longer
  const allPages: dbTypes.Page[] = allDocs.map((d) => d.get());
  const pages = (ps) => ps.map((p) => PageListItem(dbL, p, () => open(p)));

  return (
    <div>
      <h3>{dbL.name}</h3>
      <p>{dbL.description}</p>
      {pages(allPages)}
    </div>
  );
};

const ApplicationContainer = () => {
  const dbs = React.useContext(DbsContext);

  const [activeDb, setDb] = React.useState<dbTypes.LoadedDb>();
  const [activePage, setPage] = React.useState<dbTypes.Page>();

  const openPage = (d: dbTypes.LoadedDb) => (p: dbTypes.Page) => {
    setPage(p);
    setDb(d);
    console.log(`opening page ${p.title}`);
  };

  return (
    <div>
      <div style={{ width: "30%", backgroundColor: "beige", float: "left" }}>
        {dbs.map((d) => (
          <Pages dbL={d} open={openPage(d)} />
        ))}
      </div>
      <div>{activePage && <Page db={activeDb} page={activePage} />}</div>
    </div>
  );
};

export default ApplicationContainer;
