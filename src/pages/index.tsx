import React from "react";
import { useRxData, useRxCollection } from "rxdb-hooks";
import { v4 as uuidv4 } from 'uuid';

const IndexPage = () => {
  const dbcollection = useRxCollection("characters");
  const queryConstructor = (collection) => collection.find();

  const { result: characters, isFetching } = useRxData("characters", queryConstructor);

  if (isFetching) {
    return "loading characters...";
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    return await dbcollection.insert({ name: event.target[0].value, id: uuidv4() });
  };

  const handleDelete = async () => { }

  return (
    <>
      <form onSubmit={handleSubmit}>
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
