import { config as sampleConfig } from "../../sample.cfg";
import * as types from "./types";
/*
 *  The config delivering module,
 *    contains the code which loads and fetches config.
 *
 *    config loads and extends loaded config file in `extends`,
 *      and gets overridden by configs loaded in `loads`
 *
 *    TODO: think about if this should load recursively or not, or just one level deep
 *
 */
export const load
: (initial: types.Config | null) => Promise<Config>
= async (initial) =>
