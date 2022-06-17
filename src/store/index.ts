import create from "zustand";

import initialState from "./initialState";

const getLocalStorage = (key: string): object => {
  const item = typeof window !== "undefined" ? window.localStorage.getItem(key) : false;
  !item && setLocalStorage("state", initialState);
  return item ? JSON.parse(item) : initialState;
};

export const setLocalStorage = (key: string, value: object) =>
  typeof window !== "undefined" ? window.localStorage.setItem(key, JSON.stringify(value)) : false;

export const useStore = create(() => ({
  data: getLocalStorage("state"),
}));
