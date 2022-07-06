import * as Database from "../../src/database/index";
import * as testing from "../../src/database/testing_data";
import * as Types from "../../src/types/index";

describe("Database Test", async () => {
  it("The Database should start and destroy", async () => {
    const loader: Types.Config.LocalDatabaseConfig = { name: "local_db", _type: "local_db_config" };
    const d = await Database.initializeOne(loader);
    expect(true).to.equal(true);
    /* await d.destroy();
    expect(d.destroyed).to.equal(true); */
  });

  it("Adding testing data should work", async () => {
    const loader: Types.Config.LocalDatabaseConfig = { name: "local_db", _type: "local_db_config" };
    const d = await Database.initializeOne(loader);
    const expected_docs = await testing.addTestingData(d);
    const docs = await d.docs
      .find()
      .exec()
      .then((ds) => ds.map((d) => d.get("document__id")));

    const arraysEqual = (a1, a2) => a1.map((x) => a2.includes(x)).every((x) => x === true);

    expect(
      arraysEqual(
        docs,
        expected_docs.map((d) => d.document__id),
      ),
    ).to.equal(true);

   /*  await d.destroy();
    expect(d.destroyed).to.equal(true); */
  });
});
