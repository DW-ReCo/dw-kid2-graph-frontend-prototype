import React from "react";
import { RxCollection } from "rxdb";
import { useRxData, useRxCollection, RxQueryResultDoc } from "rxdb-hooks";
import { v4 as uuidv4 } from "uuid";

const IndexPage = () => {
  const dbcollection = useRxCollection<RxCollection>("characters");

  const queryConstructor = (collection: RxCollection) => collection.find();
  
  type Character = { name: string; id: string };
  
  const { result: characters }: RxQueryResultDoc<Character> = useRxData("characters", queryConstructor);
  
  if (!dbcollection) {
    return;
  }
  
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    // @ts-ignore
    return await dbcollection.insert({ name: event.target[0].value, id: uuidv4() });
  };

  const handleDelete = async (id: string) => {
    const resultToDelete = dbcollection.find({
      selector: {
        id: {
          $eq: id,
        },
      },
    });
    return await resultToDelete.remove();
  };

  const handleDeleteAll = async () => {
    const resultToDelete = dbcollection.find();
    return await resultToDelete.remove();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <button onClick={() => handleDeleteAll()}>Delete all</button>
      <ul>
        {characters.map(({ name, id }, idx) => (
          <li key={idx}>
            {name} <button onClick={() => handleDelete(id)}>delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default IndexPage;
