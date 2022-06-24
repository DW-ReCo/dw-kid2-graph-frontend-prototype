import { AppState } from "@data-types/index";

export default <AppState>{
  app: {
    status: {
      diagnostic: "INITIAL",
      message: "APP_INITIAL",
    },
    activeDb: "",
    activePage: "",
  },
  db: {
    status: {
      diagnostic: "INITIAL",
      message: "DB_INITIAL",
    },
  },
  config: {
    status: {
      diagnostic: "INITIAL",
      message: "CONFIG_INITIAL",
    },
  },
};
