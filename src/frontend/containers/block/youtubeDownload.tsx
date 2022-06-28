import React from "react";
import { upsertOne } from "@db/index";
import * as Types from "@data-types/index";
import * as Queries from "@db/queries";
import useConfigContext from "@frontend/hooks/contexts/useConfigContext";
import * as Logger from "@logger/index";
import DownloadService from "@services/downloadYoutube";
import { useRxQuery } from "rxdb-hooks";
import {
  Observable,
  of, // concatMap,
  /// delay
} from "rxjs";

const log = Logger.makeLogger("frontend/containers/block/youtubeDownload");

const ChooseVideo = (props: { db: Types.LoadedDb; choose: (link: Types.DataYoutubeUrl) => void }) => {
  const { db, choose } = props;

  const { result } = useRxQuery(
    db.instance.docs.find({
      selector: {
        data__type: Types.DataType.youtube_url,
      },
    }),
  );
  const links: Types.DataYoutubeUrl[] = result.map((r) => r.get());

  return (
    <>
      {links.map((l) => (
        <li key={l.document__id}>
          {l.data__body}
          <button onClick={() => choose(l)}> choose</button>
        </li>
      ))}
    </>
  );
};

const DownloadVideo = (props: { db: Types.LoadedDb; block: Types.BlockYoutubeDownload }) => {
  const { db, block } = props;
  const { block__chosen_video: chosen, block__youtube_download_execution: execution } = block;

  // @ts-ignore FIXME
  const { configState: config } = useConfigContext();

  // on mount
  React.useEffect(() => {
    if (!execution && chosen) {
      DownloadService.execute(
        db.instance,
        config,
      )(chosen)
        .then((e: Types.ExecutionYoutubeDL) => {
          log.info(`downloaded video, execution:`, e);
          Queries.merge(db.instance, { document__id: block.document__id, block__youtube_download_execution: e });
        })
        .catch(log.throw);
    }
  }, []);

  if (!chosen) {
    log.error(`trying to download without chosen video set`);
    return <>failure</>;
  }

  return <>downloading...</>;
};

export const Component = (props: { db: Types.LoadedDb; block: Types.BlockYoutubeDownload }) => {
  const { db, block } = props;
  const { block__chosen_video: chosen, block__youtube_download_execution: execution } = block;

  const choose = (l: Types.DataYoutubeUrl) => {
    // @ts-ignore
    Queries.mergeBlock(db.instance, { document__id: block.document__id, block__chosen_video: l });
    log.debug(`chose`, l);
  };

  if (!chosen) return <ChooseVideo db={db} choose={choose} />;

  if (!execution) return <DownloadVideo db={db} block={block} />;

  const vid = execution.execution__to_data[0].data__body;

  return (
    <div>
      downloaded video:
      <video controls src={vid.video_link} />
      {vid.video_link} <br />
      {vid.meta_link}
    </div>
  );

  return <>{JSON.stringify(block)}</>;
};

// downloading a youtube link is only availavle when the service is
export const isAvailable = (db: Types.LoadedDb, cfg: Types.PartialConfig): Observable<boolean> =>
  DownloadService.isAvailable(db.instance, cfg);

// adds a block to the database, initializing with existing data if this
// has already been chosen
export const add = async (db: Types.LoadedDb, existingData?: Types.DataYoutubeUrl) => {
  log.debug("adding block youtubedownload");
  const newBlock: Types.BlockYoutubeDownload = {
    ...Types.createDocument(),
    document__type: Types.DocumentType.Block,
    block__type: Types.BlockType.downloaded_video,
    block__state: "open",
    block__chosen_video: existingData || undefined,
    block__youtube_download_execution: undefined,
  };
  await upsertOne(db.instance, newBlock);
  return newBlock;
};
