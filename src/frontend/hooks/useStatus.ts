import * as Types from "@data-types/contexts";

import useConfigContext from "./contexts/useConfigContext";
import useDbContext from "./contexts/useDbContext";

const useStatus = () => {
  // @ts-ignore could be undefined FIXME
  const { databaseState } = useDbContext();
  // @ts-ignore could be undefined FIXME
  const { configState } = useConfigContext();

  const getConfigStatus = (): Types.status => {
    if (!configState) {
      return { diagnostic: "ERROR", message: "CONFIG_NOT_FOUND" };
    }

    if (configState?.dbs?.length < 1 || !configState.dbs) {
      return { diagnostic: "WARNING", message: "CONFIG_NO_DBS_CONFIGURED" };
    }
    return { diagnostic: "OK", message: "CONFIG_OK" };
  };

  const getDbStatus = (): Types.status => {
    if (databaseState?.length < 1) {
      return { diagnostic: "ERROR", message: "DB_NO_DB" };
    }

    if (databaseState?.length > 1) {
      return { diagnostic: "OK", message: "DB_LOADED" };
    }

    return { diagnostic: "UNKNOWN", message: "DB_UNKNOWN" };
  };

  const getAppStatus = (): Types.status => {
    if (getConfigStatus().diagnostic === "ERROR" || getDbStatus().diagnostic === "ERROR") {
      return { diagnostic: "ERROR", message: "APP_ERROR" };
    }

    if (getConfigStatus().diagnostic === "WARNING" || getDbStatus().diagnostic === "WARNING") {
      return { diagnostic: "WARNING", message: "APP_WARNING" };
    }

    return { diagnostic: "OK", message: "APP_OK" };
  };

  return {
    config: {
      status: getConfigStatus(),
    },
    db: {
      status: getDbStatus(),
    },
    app: {
      status: getAppStatus(),
    },
  };
};

export default useStatus;
