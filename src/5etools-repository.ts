// no stuff in localStorage
// 1. fetch all data
// 2. persist in localStorage: `{lastUpdatedAt: new Date(), data: ...}`
// https://api.github.com/repos/5etools-mirror-1/5etools-mirror-1.github.io/commits?since=... {Date}

// stuff in localStorage
// 1. /commits for this repository, get last commit
// 2. localStorage.lastUpdatedAt < lastCommit.createdAt
// 2a: if true, fetch and regenerate localStorage
// 2b: if false, just use localStorage

export type Json = {
  sha: string;
  url: string;
  tree: {
    path: string;
    mode: string;
    type: string;
    sha: string;
    size: number;
    url: string;
  }[];
};

export type BestiaryFileNames = string[];

export const findSubfolderUrl = (json: Json, subfolder: string) => {
  const subfolderObjArr = json.tree.filter((node) => node.path === subfolder);
  if (subfolderObjArr.length === 1) {
    return subfolderObjArr[0].url;
  } else {
    throw new Error(
      `json "${json}" constains multiple subfolders called "${subfolder}"`
    );
  }
};

// lib: fetchJSON ('repoUrl' -> 'url')
export const getJsonFromRepoUrl = (repoUrl: string) => {
  return fetch(repoUrl).then((res) => res.json());
};

export const getBestiaryFolderUrl = () => {
  const masterBranchUrl =
    "https://api.github.com/repos/5etools-mirror-1/5etools-mirror-1.github.io/git/trees/master";
  return getJsonFromRepoUrl(masterBranchUrl)
    .then((masterBranchObj) => findSubfolderUrl(masterBranchObj, "data"))
    .then(getJsonFromRepoUrl)
    .then((dataFolderObj) => findSubfolderUrl(dataFolderObj, "bestiary"));
};

export const isBestiary = (filename: string) =>
  filename.includes("bestiary") && !filename.includes("fluff");

export const isOfficialContent = (filename: string) => !filename.includes("ua");

export const getBestiaryFileNames = (json: Json) => {
  return json.tree
    .filter((treeObj) => {
      const filename = treeObj.path;
      return isBestiary(filename) && isOfficialContent(filename);
    })
    .map((bestiaryObjectList) => bestiaryObjectList.path);
};

export const getBestiaryFileNamesFromRepoUrl = (): Promise<BestiaryFileNames> => {
  return getBestiaryFolderUrl()
    .then(getJsonFromRepoUrl)
    .then(getBestiaryFileNames)
};
