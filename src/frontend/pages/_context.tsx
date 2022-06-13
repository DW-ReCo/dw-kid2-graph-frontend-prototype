import React, { useState, useEffect } from "react";
import * as dbTypes from "../../db/types";

export const DbsContext = React.createContext<dbTypes.LoadedDb[]>([]);
