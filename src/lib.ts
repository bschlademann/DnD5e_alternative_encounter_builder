export const getJsonFromUrl = (repoUrl: string) => {
  return fetch(repoUrl).then((res) => res.json());
};

export const setLocalStorage = (data: unknown) => (key: string) =>
  localStorage.setItem(key, JSON.stringify(data));

export const getLocalStorage = (key: string) => {
  localStorage.getItem(key);
};

export const getSetArray = (arr: any[]) => Array.from(new Set(arr));