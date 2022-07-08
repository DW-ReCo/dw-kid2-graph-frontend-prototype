// A service for a user, using the frontent, to directly add
//  data to the database.
import { Observable, combineLatest, from, map, of } from "rxjs";

import * as Types from "@data-types/index";

import * as Queries from "@database/queries";

import { uniqueId } from "@frontend/utils";

import * as Logger from "@logger/index";

import * as Utils from "@utils/index";

const log = Logger.makeLogger(`services/downloadYoutube`);

const serviceStatus = {
  // service ready
  ok: { status: 200, message: "ok lets go" },
  //  no data to operate on
  nodata: { status: 418, message: "no data to operate on" },
  // missing cfg
  noconfig: { status: 401, message: "missig config" },
  // server offline
  noserver: { status: 500, message: "cannot reach server" },
} as const;

type StatusType = keyof typeof serviceStatus;
type ServiceStatus = typeof serviceStatus[StatusType];

const status = (dataNodes: Types.Data.Data[], config: Types.Config.PartialConfig): Observable<ServiceStatus> => {
  log.debug(`creating status observable`);

  if (!config.youtube_downloader?.api_url) return of(serviceStatus.noconfig);

  const { api_url, user, password } = config.youtube_downloader;

  log.debug(api_url);

  const headers = new Headers();
  headers.set("Authorization", "Basic " + btoa(user + ":" + password));

  const isApiOnline = from(
    fetch(`${api_url}/ping`, { method: "GET", headers })
      .then((r) => r.json())
      .catch((e) => {
        log.error(e);
        return serviceStatus.noserver;
      })
      .then((x) => x?.message == "ok lets go"),
  );

  const possibleDataNodes = dataNodes.filter((d) => d.data__type === Types.Data.Type.youtube_url);

  const isDataAvailable = of(possibleDataNodes).pipe(map((x) => x.length > 0));

  const combined = combineLatest(isApiOnline, isDataAvailable, (apiStatus: boolean, dataStatus: boolean) => {
    log.debug("api available:", apiStatus);
    log.debug("data available:", dataStatus);
    if (!apiStatus) return serviceStatus.noserver;
    if (!dataStatus) return serviceStatus.nodata;
    return serviceStatus.ok;
  });

  return combined;
};

const isAvailable = (dataNodes: Types.Data.Data[], config: Types.Config.PartialConfig) => {
  //
  log.debug(`checking if youtube service is available`);
  return status(dataNodes, config).pipe(map((status) => serviceStatus.ok == status));
};

const execute = (config: Types.Config.PartialConfig) => async (data: Types.Data.YoutubeUrl) => {
  // TODO validate data
  const validData = data;
  const url = data.data__body;

  if (!config.youtube_downloader) {
    throw Error(`wrong`);
  }

  const { api_url, user, password } = config.youtube_downloader;

  log.debug(`attempting to fetch ${url} from ${api_url}`);

  const headers = new Headers();
  headers.set("Authorization", "Basic " + btoa(user + ":" + password));

  headers.set("Content-Type", "application/json");

  const started_at = Utils.now();

  // TODO validate the result
  const apiResult: Types.Data.YoutubeDownloaded["data__body"] = await fetch(`${api_url}/download`, {
    method: "POST",
    headers,
    body: JSON.stringify({ url: data.data__body }),
  }).then((r) => r.json());

  log.debug(`received`, apiResult);

  const to_data: Types.Data.YoutubeDownloaded = {
    ...Types.Document.createDocument(),
    document__type: Types.Document.Type.Data,
    data__type: Types.Data.Type.youtube_downloaded,
    data__body: apiResult,
  };

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
  status: status, // -> Observable<ServiceStatus>
  isAvailable, // -> Observable<boolean>
  execute,
};

export default service;
