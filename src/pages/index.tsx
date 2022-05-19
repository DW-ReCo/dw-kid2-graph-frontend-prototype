import React from "react";
import { useRxData, useRxCollection } from "rxdb-hooks";

const IndexPage = () => {
  const dbcollection = useRxCollection("characters");
  const queryConstructor = (collection) => collection.find().where("affiliation").equals("jedi");

  const { result: characters, isFetching } = useRxData("characters", queryConstructor);

  if (isFetching) {
    return "loading characters...";
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    return await dbcollection.insert({ name: event.target[1].value, id: event.target[0].value });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          ID:
          <input type="text" name="id" />
        </label>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <ul>
        {characters.map((character, idx) => (
          <li key={idx}>{character.name}</li>
        ))}
      </ul>
    </>
  );
};

export default IndexPage;
