import React from "react";
import * as DatabaseTypes from "@data-types/index";
import clsx from "clsx";

import * as Types from "@data-types/index";
import * as Queries from "@database/queries";
import DeleteIcon from "@frontend/assets/icons/delete";
import useAppContext from "@frontend/hooks/contexts/useAppContext";

const PageListItem = (props: { db: Types.Database.LoadedDb; page: Types.Page.Page; open: () => void }) => {
  const { page, open, db } = props;

  const {
    // @ts-ignore
    appState: {
      // @ts-ignore
      app: { activePage },
    },
  } = useAppContext();

  const remove = (db: Types.Database.LoadedDb, id: string) => Queries.remove(db.instance, id);

  return (
    <li className="inline-flex flex-nowrap">
      <button
        onClick={open}
        className={clsx(
          "w-[9rem] p-0 text-[#72706b] m-0 text-left bg-transparent hover:bg-transparent hover:underline",
          activePage === page.document__id && "underline",
        )}
      >
        {page.page__title}
      </button>
      <button
        onClick={() => remove(db, page.document__id)}
        className="text-black p-0 bg-transparent hover:bg-transparent hover:text-slate-500 m-1"
      >
        <DeleteIcon />
      </button>
    </li>
  );
};

export default PageListItem;
