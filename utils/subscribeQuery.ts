import { RxDatabase, RxQuery } from 'rxdb';

export const subscribeQuery = (q: RxQuery, f: (results: any): void) => {
  q.$.subscribe(f);
}

export const alsoSubscribeQuery: (q: RxQuery, f: (results:any): void) =
  (q, f) => q.$.subscribe(f);

export const listenToCharacters = (db: RxDatabase) => {
  const collection = db.characters;
  const q = collection.find()
  q.$.subscribe(results => {
    console.log('got results: ', results.map(r => r.get()));
  });
}
