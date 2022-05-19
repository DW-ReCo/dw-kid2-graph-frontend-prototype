import React from "react";
import { useRxData } from "rxdb-hooks";

const IndexPage = () => {
  const queryConstructor = (collection) => collection.find().where("affiliation").equals("jedi");

  const { result: characters, isFetching } = useRxData("characters", queryConstructor);

  if (isFetching) {
    return "loading characters...";
  }

  return (
    <ul>
      {characters.map((character, idx) => (
        <li key={idx}>{character.name}</li>
      ))}
    </ul>
  );
};

export default IndexPage;
