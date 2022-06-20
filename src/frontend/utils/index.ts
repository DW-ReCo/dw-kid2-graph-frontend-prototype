import React from "react";
import { Observable } from "rxjs";

// takes a promise, and returns a react hook for it.
// use like this:
//
// export const isAvailable = (db: dbTypes.LoadedDb): Promise<boolean> => Promise.resolve(true);
//
// const maybeAddNote = promiseAsHook(note.isAvailable(db)) && "it's available!";
//
export const promiseAsHook = <T>(p: Promise<T>) => {
  const [result, setResult] = React.useState<T>();

  React.useEffect(() => {
    p.then(setResult);
  }, []);

  return result;
};

// takes a promise, and returns a react hook for it.
// usage:
//
// export const isAvailable = (db: dbTypes.LoadedDb): Observable<boolean> =>
//   of(true, false, true, false, true).pipe(concatMap(x => of(x).pipe(delay(1000))));
//
// const maybeAddNote = observableAsHook(note.isAvailable(db)) && "it's available!";
export const observableAsHook = <T>(o: Observable<T>) => {
  const [result, setResult] = React.useState<T>();

  React.useEffect(() => {
    o.subscribe((v) => {
      setResult(v);
    });
  }, []);

  return result;
};
