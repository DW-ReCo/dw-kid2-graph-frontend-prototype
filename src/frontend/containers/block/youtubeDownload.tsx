import React from "react";
import { upsertOne } from "@database/index";
import * as Types from "@data-types/index";
import * as Queries from "@database/queries";
import useConfigContext from "@frontend/hooks/contexts/useConfigContext";
import * as Logger from "@logger/index";
import DownloadService from "@services/downloadYoutube";
import { useRxQuery } from "rxdb-hooks";
import { Observable } from "rxjs";

const log = Logger.makeLogger("frontend/containers/block/youtubeDownload");

const ChooseVideo = (props: { db: Types.Database.LoadedDb; choose: (link: Types.Data.YoutubeUrl) => void }) => {
  const { db, choose } = props;

  const { result } = useRxQuery(
    db.instance.docs.find({
      selector: {
        data__type: Types.Data.Type.youtube_url,
      },
    }),
  );
  const links: Types.Data.YoutubeUrl[] = result.map((r) => r.get());

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

const DownloadVideo = (props: { db: Types.Database.LoadedDb; block: Types.Block.YoutubeDownload }) => {
  const { db, block } = props;
  const { block__chosen_video: chosen, block__youtube_download_record: execution } = block;

  // @ts-ignore FIXME
  const { configState: config } = useConfigContext();

  // on mount
  React.useEffect(() => {
    if (!execution && chosen) {
      DownloadService.execute(
        db.instance,
        config,
      )(chosen)
        .then((e: Types.Record.YoutubeDL) => {
          log.info(`downloaded video, execution:`, e);
          Queries.merge(db.instance, { document__id: block.document__id, block__youtube_download_record: e });
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

export const Component = (props: { db: Types.Database.LoadedDb; block: Types.Block.YoutubeDownload }) => {
  const { db, block } = props;
  const { block__chosen_video: chosen, block__youtube_download_record: execution } = block;

  const choose = (l: Types.Data.YoutubeUrl) => {
    // @ts-ignore
    Queries.mergeBlock(db.instance, { document__id: block.document__id, block__chosen_video: l });
    log.debug(`chose`, l);
  };

  if (!chosen) return <ChooseVideo db={db} choose={choose} />;

  if (!execution) return <DownloadVideo db={db} block={block} />;

  const vid = execution.record__to_data[0].data__body;

  return (
    <div>
      downloaded video:
      <video controls src={vid.video_link} />
      {vid.video_link} <br />
      {vid.meta_link}
    </div>
  );
};

// downloading a youtube link is only availavle when the service is
export const isAvailable = (db: Types.Database.LoadedDb, config: Types.Config.PartialConfig): Observable<boolean> =>
  DownloadService.isAvailable(db.instance, config);

// adds a block to the database, initializing with existing data if this
// has already been chosen
export const add = async (db: Types.Database.LoadedDb, existingData?: Types.Data.YoutubeUrl) => {
  log.debug("adding block youtubedownload");
  const newBlock: Types.Block.YoutubeDownload = {
    ...Types.Document.createDocument(),
    document__type: Types.Document.Type.Block,
    block__type: Types.Block.Type.downloaded_video,
    block__state: "open",
    block__chosen_video: existingData || undefined,
    block__youtube_download_record: undefined,
  };
  await upsertOne(db.instance, newBlock);
  return newBlock;
};
