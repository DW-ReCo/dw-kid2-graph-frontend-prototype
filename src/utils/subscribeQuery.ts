import { RxDatabase, RxQuery } from "rxdb";
import { Subscription } from "rxjs";

export const subscribeQuery = (q: RxQuery, f: (results: any) => void): Subscription => {
  return q.$.subscribe(f);
};

export const alsoSubscribeQuery: (q: RxQuery, f: (results: any) => void) => Subscription = (q, f) => q.$.subscribe(f);

export const listenToCharacters = (db: RxDatabase) => {
  const collection = db.characters;
  const q = collection.find();
  q.$.subscribe((results) => {
    console.log(
      "got results: ",
      results.map((r) => r.get()),
    );
  });
};
