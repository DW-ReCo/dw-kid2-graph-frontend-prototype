import { upsertOne } from "@db/index";
import * as queries from "@db/queries";
import * as dbTypes from "@db/types";
import * as Logger from "@logger/index";
import React from "react";
import { RxDocumentBase } from "rxdb";
import { useRxQuery } from "rxdb-hooks";
import {
  every,
  filter,
  Observable,
  map,
  of, // concatMap,
  /// delay
} from "rxjs";
import { v4 as uuidv4 } from "uuid";

const log = Logger.makeLogger("frontend/containers/block/youtubeLink");

export const Add = (props: { db: dbTypes.LoadedDb; block: dbTypes.BlockYoutubeInput }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { db, block } = props;

  const [url, setUrl] = React.useState<string>("");

  const addLink = () => {
    // TODO validate that it _is_ actually a youtube link
    const validatedLink = url;
    const newId = uuidv4();
    const data: dbTypes.DataYoutubeUrl = {
      id: newId,
      type: "youtube_url",
      // @ts-ignore FIXME
      document_type: "data",
      // @ts-ignore FIXME
      body: validatedLink,
    };
    upsertOne(db.instance, data).then((_) => {
      queries.merge(db.instance, block.id, { dataId: newId });
    });
  };

  return (
    <>
      Add a youtube link:
      <input placeholder="paste url" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={addLink}>Add</button>
    </>
  );
};

export const Component = (props: { db: dbTypes.LoadedDb; block: dbTypes.BlockYoutubeInput }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { db, block } = props;

  const dataQuery = useRxQuery(queries.data(db.instance, block.dataId));
  const data = dataQuery.result && dataQuery.result[0] && dataQuery.result[0].get();

  if (!block.dataId || !data) return <Add db={db} block={block} />;

  return <div>{data?.body}</div>;
};

// the ability to add a youtube link is always available
export const isAvailable = (db: dbTypes.LoadedDb): Observable<boolean> => of(true);
/* prettier-ignore */
/* export const isAvailable = (db: dbTypes.LoadedDb): Observable<boolean> =>
 *   queries.allData(db.instance).$
 *          .pipe(map(docs => {
 *            return docs
 *              .filter(doc => doc.get().type == "youtube_url")
 *              .some(x => x)
 *          }))
 *  */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const add = async (db: dbTypes.LoadedDb) => {
  log.debug("adding block");
  const newNote: dbTypes.BlockYoutubeInput = {
    id: uuidv4(),
    //@ts-ignore
    document_type: "block",
    type: "youtube_url_input",
  };
  await upsertOne(db.instance, newNote);
};
