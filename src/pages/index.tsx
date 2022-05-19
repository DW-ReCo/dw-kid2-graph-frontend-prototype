import React from "react";

import * as db from "../../db";

const IndexPage = () => {
  if (typeof window !== "undefined") {
    // client-side-only code
    db.createDb().then(console.log);
  }

  return <div>Hello from IndexPage</div>;
};

export default IndexPage;
