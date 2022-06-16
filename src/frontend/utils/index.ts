import React from "react";

// takes a promise, and returns a react hook for it.
export const promiseAsHook = <T>(p: Promise<T>) => {
  const [result, setResult] = React.useState<T>();

  React.useEffect(() => {
    p.then(setResult);
  }, []);

  return result;
}
