import React from "react";
import Block from "../../src/frontend/containers/block/index";

import { generateTestingDocs1 } from "../../src/db/testing_data";
import * as dbTypes from "../../src/db/types";
import * as cfgTypes from "../../src/cfg/types";
import * as db from "../../src/db";

const docs: dbTypes.DbDocument[] = generateTestingDocs1();

const blocks = docs.filter(dbTypes.isBlock);

describe("ComponentName.cy.ts", () => {
  it("playground", async () => {
    const loader: cfgTypes.LocalDbConfig = { name: "local_db", _type: "local_db_config" };
    const d: dbTypes.LoadedDb = await db.initializeOne(loader).then((x) => ({ ...loader, db: x }));

    cy.mount(<Block db={d} block={blocks[0]} />);
  });
});
