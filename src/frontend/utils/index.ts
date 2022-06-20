import React from "react";
import { Observable } from "rxjs";

// takes a promise, and returns a react hook for it.
// use like this:
//
// export const isAvailable = (_): Promise<boolean> => Promise.resolve(true);
//
// const maybeAddNote = usePromise(isAvailable()) && "it's available!";
//
export const usePromise = <T>(p: Promise<T>) => {
  const [result, setResult] = React.useState<T>();

  React.useEffect(() => {
    p.then(setResult);
  }, []);

  return result;
};

// takes an observable, and returns a react hook for it.
// usage:
//
// export const isAvailable = (): Observable<boolean> =>
//   of(true, false, true, false, true).pipe(concatMap(x => of(x).pipe(delay(1000))));
//
// const maybeAddNote = useObservable(isAvailable()) && "it's available!";
export const useObservable = <T>(o: Observable<T>) => {
  const [result, setResult] = React.useState<T>();

  React.useEffect(() => {
    o.subscribe((v) => {
      setResult(v);
    });
  }, []);

  return result;
};
