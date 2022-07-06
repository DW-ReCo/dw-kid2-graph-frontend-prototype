// A service for a user, using the frontent, to directly add
//  data to the database.
import { combineLatest, from, map, of } from "rxjs";

import * as Types from "@data-types/index";

import * as Queries from "@database/queries";

import { uniqueId } from "@frontend/utils";

import * as Logger from "@logger/index";

import * as Utils from "@utils/index";

const log = Logger.makeLogger(`services/downloadYoutube`);

const isAvailable = (dataNodes: Types.Data.Data[], config: Types.Config.PartialConfig) => {
  //
  log.debug(`checking if youtube service is available`);

  if (!config.youtube_downloader?.api_url) return of(false);

  const { api_url, user, password } = config.youtube_downloader;

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

  const dataAvailable = of(dataNodes).pipe(
      map((x) => {
        return x.length > 0;
      }),
    );

  const combined = combineLatest(from(checkApi), dataAvailable, (a, b) => {
    log.debug("api available:", a);
    log.debug("data available:", b);
    return a && b;
  });

  return combined;

  // return from(checkApi);
};

const execute = (config: Types.Config.PartialConfig) =>
  async (data: Types.Data.YoutubeUrl) => {
    // TODO validate data
    const validData = data;
    const url = data.data__body;

    if (!config.youtube_downloader) { throw Error(`wrong`) }

    const { api_url, user, password } = config.youtube_downloader;

    log.debug(`attempting to fetch ${url} from ${api_url}`)


    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(user + ":" + password));

    headers.set('Content-Type', 'application/json');

    const started_at = Utils.now();

    // TODO validate the result
    const apiResult: Types.Data.YoutubeDownloaded["data__body"] =
      await fetch(`${api_url}/download`, { method: 'POST', headers, body: JSON.stringify({ "url": data.data__body }) })
        .then(r => r.json())

    log.debug(`received`, apiResult)

    const to_data: Types.Data.YoutubeDownloaded = {
      ...Types.Document.createDocument(),
      document__type: Types.Document.Type.Data,
      data__type: Types.Data.Type.youtube_downloaded,
      data__body: apiResult
    }

    const finished_at = Utils.now();

    const newRecord: Types.Record.YoutubeDL = {
      document__id: uniqueId(),
      document__type: Types.Document.Type.Record,
      record__type: Types.Service.Type.youtuve_download_v1,
      record__started_at: started_at,
      record__finished_at: finished_at,
      record__of_data: [validData],
      record__to_data: [to_data],
    };

    return newRecord;
  };

const service: Types.Service.YoutubeDownload = {
  // the user adding service is always available
  name: "youtube downloading service",
  type: Types.Service.Type.youtuve_download_v1,
  description: "downloads a youtube video to our servers",
  isAvailable: isAvailable,
  execute,
};

export default service;
