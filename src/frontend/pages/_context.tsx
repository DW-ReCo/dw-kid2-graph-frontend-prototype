import React from "react";

import * as dbTypes from "../../db/types";

export const DbsContext = React.createContext<dbTypes.LoadedDb[]>([]);
