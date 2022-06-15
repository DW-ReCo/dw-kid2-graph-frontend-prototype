import * as db from "../../src/db";
import * as queries from "../../src/db/queries";
import * as testing from "../../src/db/testing_data";

import * as cfg from "../../src/cfg";
import * as cfgTypes from "../../src/cfg/types";


describe('Database Test', async () => {

  it('The Database should start and destroy', async () => {
    const loader: cfgTypes.LocalDbConfig = { name: "local_db", _type: "local_db_config" };
    const d = await db.initializeOne(loader);
    expect(true).to.equal(true);
    await d.destroy();
    expect(d.destroyed).to.equal(true);
  })

  it('Adding testing data should work', async () => {

    const loader: cfgTypes.LocalDbConfig = { name: "local_db", _type: "local_db_config" };
    const d = await db.initializeOne(loader);
    const expected_docs = await testing.addTestingData(d);
    const docs = await d.docs.find().exec().then(ds => ds.map(d => d.get("id")))

    const arraysEqual = (a1, a2) => a1.map(x => a2.includes(x)).every(x => x === true);

    expect(arraysEqual(docs, expected_docs.map(d => d.id))).to.equal(true);

    await d.destroy();
    expect(d.destroyed).to.equal(true);
  })
})
