// A service for a user, using the frontent, to directly add
//  data to the database.
import { of, from } from "rxjs";
import * as Types from "@data-types/index";
import * as Utils from "@utils/index";

import * as Queries from "@db/queries";
import { uniqueId } from "@frontend/utils";
import { RxDatabase } from "rxdb";

import * as Logger from "@logger/index";

const log = Logger.makeLogger(`services/downloadYoutube`);

const isAvailable = (db: RxDatabase, cfg: Types.PartialConfig) => {
  if (!cfg.youtube_downloader?.api_url) return of(false);

  const { api_url, user, password } = cfg.youtube_downloader;

  const headers = new Headers();
  headers.set("Authorization", "Basic " + btoa(user + ":" + password));

  const check = fetch(`${api_url}/ping`, { method: "GET", headers })
    .then((r) => r.json())
    .then((x) => {
      console.log("oooooooooooooooooooooo");
      console.log(x);
      return x;
    });

  return from(check);
};

/* prettier-ignore */
const execute: Types.ExecuteFunction<[Types.DataYoutubeUrl], [Types.DataYoutubeDownloaded]> =
  (db, cfg) =>
    async (data) => {
      // TODO validate data
      const validData = data;
      const url = data.data__body;

      if (!cfg.youtube_downloader) { log.throw(`using youtube service without youtube config`); return; }

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

      const newExecution: Types.ExecutionUserAdded = {
        document__id: uniqueId(),
        document__type: Types.DocumentType.Execution,
        execution__type: Types.ExecutionType.user_added,
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
  isAvailable: (..._) => of(true),
  execute,
};

export default service;
