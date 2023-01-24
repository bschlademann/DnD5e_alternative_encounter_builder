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
