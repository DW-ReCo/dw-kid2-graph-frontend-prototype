import * as DatabaseTypes from "@data-types/index";
import * as Types from "@data-types/index";
import * as Queries from "@database/queries";
import DeleteIcon from "@frontend/assets/icons/delete";
import useAppContext from "@frontend/hooks/contexts/useAppContext";
import clsx from "clsx";
import React from "react";

const PageListItem = (props: { db: Types.Database.LoadedDatabase; page: Types.Page.Page; open: () => void }) => {
  const { page, open, db } = props;

  const {
    // @ts-ignore
    appState: {
      // @ts-ignore
      app: { activePage },
    },
  } = useAppContext();

  const remove = (db: Types.Database.LoadedDatabase, id: string) => Queries.remove(db.instance, id);

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
