// A service for a user, using the frontent, to directly add
//  data to the database.
import { of, from, map, combineLatest } from "rxjs";
import * as Types from "@data-types/index";
import * as Utils from "@utils/index";

import * as Queries from "@db/queries";
import { uniqueId } from "@frontend/utils";
import { RxDatabase } from "rxdb";

import * as Logger from "@logger/index";

const log = Logger.makeLogger(`services/downloadYoutube`);

const isAvailable = (db: RxDatabase, cfg: Types.PartialConfig) => {
  //
  log.debug(`isAvailable`);
  log.debug(cfg);

  if (!cfg.youtube_downloader?.api_url) return of(false);

  const { api_url, user, password } = cfg.youtube_downloader;

  log.debug(api_url);

  const headers = new Headers();
  headers.set("Authorization", "Basic " + btoa(user + ":" + password));

  const checkApi = fetch(`${api_url}/ping`, { method: "GET", headers })
    .then((r) => r.json())
    .catch((e) => {
      log.error(e);
      return false;
    })
    .then((x) => x?.message == "ok lets go");

  const dataAvailable = db.docs
    .find({
      selector: {
        data__type: Types.DataType.youtube_url,
      },
    })
    .$.pipe(
      map((x) => {
        return x.length > 0;
      }),
    );

  const combined = combineLatest(from(checkApi), dataAvailable, (a, b) => a && b);

  return combined;

  // return from(checkApi);
};

/* prettier-ignore */
const execute: Types.ExecuteFunction<[Types.DataYoutubeUrl], [Types.DataYoutubeDownloaded]> =
  (db, cfg) =>
    async (data) => {
      // TODO validate data
      const validData = data;
      const url = data.data__body;

      if (!cfg.youtube_downloader) { throw Error(`wrong`) }

      const { api_url, user, password } = cfg.youtube_downloader;

      log.debug(`attempting to fetch ${url} from ${api_url}`)


      const headers = new Headers();
      headers.set('Authorization', 'Basic ' + btoa(user + ":" + password));

      const started_at = Utils.now();

      const result: Types.DataYoutubeDownloaded =
        await fetch(`${api_url}/download`, {method: 'POST', headers})
        .then(r => r.json())

      log.debug(`received`, result)

      const finished_at = Utils.now();

      const newExecution: Types.ExecutionYoutubeDL = {
        document__id: uniqueId(),
        document__type: Types.DocumentType.Execution,
        execution__type: Types.ExecutionType.download_youtube_v1,
        execution__started_at: started_at,
        execution__finished_at: finished_at,
        execution__of_data: [validData],
        execution__to_data: [result],
      };

      await Queries.upsertOne(db, newExecution);

      return newExecution;
    };

const service: Types.YoutubeDownloadService = {
  // the user adding service is always available
  name: "youtube downloading service",
  description: "downloads a youtube video to our servers",
  isAvailable: isAvailable,
  execute,
};

export default service;
