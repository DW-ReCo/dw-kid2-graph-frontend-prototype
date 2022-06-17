import * as dbTypes from "../../db/types";
import React from "react";

export const DbsContext = React.createContext<dbTypes.LoadedDb[]>([]);
