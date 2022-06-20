// import { upsertOne } from "@db/index";
import { upsertOne } from "@db/";
import * as queries from "@db/queries";
import * as dbTypes from "@db/types";
import React from "react";
import { useRxQuery } from "rxdb-hooks";
import {
  Observable,
  of, // concatMap,
  /// delay
} from "rxjs";
import { v4 as uuidv4 } from "uuid";

export const Add = (props: { db: dbTypes.LoadedDb; block: dbTypes.BlockYoutubeInput }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { db, block } = props;
  const [url, setUrl] = React.useState<string>("");

  const addLink = (url) => {
    // TODO validate that it _is_ actually a youtube link
    const validatedLink = url;
    const id = uuidv4();
    const data: dbTypes.DataYoutubeUrl = {
      id,
      type: "youtube_url",
      // @ts-ignore
      document_type: "data",
      body: validatedLink,
    };
    upsertOne(data).then((x) => {
      console.log(x);
    });
  };

  return (
    <>
      <input placeholder="paste url" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={addLink}>Add</button>
    </>
  );
};

export const Component = (props: { db: dbTypes.LoadedDb; block: dbTypes.BlockYoutubeInput }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { db, block } = props;
  const { dataId } = block;

  const dataQuery = useRxQuery(queries.data(db.instance, dataId));
  const data = dataQuery.result && dataQuery.result[0] && dataQuery.result[0].get();

  if (!data) return <Add db={db} block={block} />;

  return <>{data.body}</>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isAvailable = (db: dbTypes.LoadedDb): Observable<boolean> => of(true); // .pipe(concatMap((x) => of(x).pipe(delay(1000))));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const add = async (db: dbTypes.LoadedDb) => {
  await Promise.resolve(true);
};
