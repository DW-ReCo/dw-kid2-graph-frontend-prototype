import React from "react";
import * as DatabaseTypes from "@data-types/index";
import clsx from "clsx";

import * as Queries from "@db/queries";
import DeleteIcon from "@frontend/assets/icons/delete";
import useAppContext from "@frontend/hooks/contexts/useAppContext";

const PageListItem = (props: { db: DatabaseTypes.LoadedDb; page: DatabaseTypes.Page; open: () => void }) => {
  const { page, open, db } = props;

  const {
    // @ts-ignore
    appState: {
      // @ts-ignore
      app: { activePage },
    },
  } = useAppContext();

  const remove = (db: DatabaseTypes.LoadedDb, id: string) => Queries.remove(db.instance, id);

  return (
    <li className="inline-flex flex-nowrap">
      <button
        onClick={open}
        className={clsx(
          "w-[9rem] p-1 text-black m-0 text-left",
          activePage === page.document__id ? "bg-teal-200" : "bg-transparent",
        )}
      >
        {page.page__title}
      </button>
      <button
        onClick={() => remove(db, page.document__id)}
        className="text-black p-0 bg-transparent hover:bg-transparent hover:text-slate-500  m-1"
      >
        <DeleteIcon />
      </button>
    </li>
  );
};

export default PageListItem;
