import { upsertOne } from "@db/index";
import * as queries from "@db/queries";
import * as dbTypes from "@db/types";
import { uniqueId } from "@frontend/utils";
import * as Logger from "@logger/index";
import userAddService from "@services/userAdd";
import React from "react";
import { useRxQuery } from "rxdb-hooks";
import {
  Observable,
  of, // concatMap,
  /// delay
} from "rxjs";

const log = Logger.makeLogger("frontend/containers/block/youtubeLink");

export const Add = (props: { db: dbTypes.LoadedDb; block: dbTypes.BlockYoutubeInput }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { db, block } = props;

  const [url, setUrl] = React.useState<string>("");

  const addLink = () => {
    // TODO validate that it _is_ actually a youtube link
    const validatedLink = url;
    const newId = uniqueId();
    const data: dbTypes.DataYoutubeUrl = {
      id: newId,
      type: "youtube_url",
      // @ts-ignore FIXME
      document_type: "data",
      // @ts-ignore FIXME
      body: validatedLink,
    };
    upsertOne(db.instance, data).then((_) => {
      queries.mergeBlock(db.instance, block.id, { dataId: newId });
    });
  };

  return (
    <>
      <p>Add a youtube link:</p>
      <input placeholder="paste url" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={addLink}>Add</button>
      <p>or choose existing:</p>
    </>
  );
};

export const Component = (props: { db: dbTypes.LoadedDb; block: dbTypes.BlockYoutubeInput }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { db, block } = props;

  const {
    result: { 0: dataDoc },
  } = useRxQuery(queries.data(db.instance, block.dataId));
  const data = dataDoc?.get();

  if (!block.dataId || !data) return <Add db={db} block={block} />;
  // <iframe src="https://www.youtube.com/embed/7A4vR1NFS_I"></iframe>
  // https://www.youtube.com/watch?v=7A4vR1NFS_I
  if (!data.body) return <div>no url</div>;
  const youtubeId = data.body.split("=").slice(-1); // TODO proper id extract
  return (
    <div>
      <iframe src={`https://www.youtube.com/embed/${youtubeId}`}></iframe>
      {data.body}
    </div>
  );
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
  const newBlock: dbTypes.BlockYoutubeInput = {
    id: uniqueId(),
    //@ts-ignore
    document_type: "block",
    type: "youtube_url_input",
  };
  await upsertOne(db.instance, newBlock);
  return newBlock;

};
