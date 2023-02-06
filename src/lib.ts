export const getJsonFromUrl = (repoUrl: string) => {
  return fetch(repoUrl).then((res) => res.json());
};

export const getSetArray = (arr: any[]) => Array.from(new Set(arr));