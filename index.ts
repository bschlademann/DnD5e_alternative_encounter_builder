import {
    powerlevelByCr,
    powerlevelByPlayerLevel,
    allBestiaryFileNames,
  } from "./data.js";
  import * as fs from "fs/promises";
  
  type Party = { playerCharacters: string[]; level: number };
  type Mob = { creatureName: string; mobSize: number };
  type LeveledNPC = { name: string; level: number };
  type BestiaryJson = { monster: { name: string; cr: string }[] };
  type CreatureStatBlock = { name: string; cr: string };
  
  const party: Party = {
    playerCharacters: ["Linea", "Nix", "Noa", "Fabians_Char", "Dörte"],
    level: 4,
  };
  const allMobs: Mob[] = [
    // {
    //   creatureName: "monodrone",
    //   mobSize: 4,
    // },
    {
      creatureName: "duodrone",
      mobSize: 1,
    },
    {
      creatureName: "tridrone",
      mobSize: 1,
    },
    {
      creatureName: "quadrone",
      mobSize: 2,
    },
  ];
  const allLeveledNPCs: LeveledNPC[] = [
    { name: "Dolgrim", level: 5 },
    // { name: "Ilyas", level: 5 },
    // { name: "Bres", level: 5 },
    // { name: "Nif", level: 5 },
  ];
  
  const getPartyPowerlevel = (party: Party) => {
    const partySize: number = party.playerCharacters.length;
    const partyLevel: number = party.level;
    const powerLevelPerCharacter: number = powerlevelByPlayerLevel[partyLevel];
    const partyPowerlevel: number = partySize * powerLevelPerCharacter;
    return partyPowerlevel;
  };
  const getJson = (filePath: string) => {
    return fs.readFile(filePath, { encoding: "utf-8" }).then((jsonString) => {
      return JSON.parse(jsonString);
    });
  };
  const getCreatureStatBlock = (
    creatureName: string,
    bestiaryJson: BestiaryJson
  ) => {
    const creatureStatBlock = bestiaryJson.monster.find(
      (statBlock: CreatureStatBlock) =>
        statBlock.name.toLocaleLowerCase() === creatureName.toLocaleLowerCase()
    );
    if (creatureStatBlock === undefined) {
      return false;
    } else return creatureStatBlock;
  };
  const parseCr = (crString: string) => {
    const isFraction = crString.includes("/");
    if (isFraction) {
      const split = crString.split("");
      const onlystringifiedNumbers = split.filter(
        (stringifiedNumber) => stringifiedNumber !== "/"
      );
      const parsedNumbers = onlystringifiedNumbers.map((stringifiedNumber) =>
        parseInt(stringifiedNumber)
      );
      const parsedCr = parsedNumbers[0] / parsedNumbers[1];
      return parsedCr;
    } else {
      const parsedCr = parseInt(crString);
      return parsedCr;
    }
  };
  const getCreatureCr = async (creatureName: string) => {
    for (const bestiaryFileName of allBestiaryFileNames) {
      const filePath = `./bestiary/${bestiaryFileName}`;
      const bestiaryJson = await getJson(filePath);
      const creatureStatblock = getCreatureStatBlock(creatureName, bestiaryJson);
      if (creatureStatblock) {
        const parsedCr = parseCr(creatureStatblock.cr);
        return parsedCr;
      }
    }
    throw new Error(`ERROR: "${creatureName}" not found in any book`);
  };
  const getCreaturePowerlevel = async (creatureName: string) => {
    const creatureCr = await getCreatureCr(creatureName);
    const creaturePowerlevel: number = powerlevelByCr[creatureCr];
    return creaturePowerlevel;
  };
  const getAllMobsPowerlevel = async (allMobs: Mob[]) => {
    let powerlevelTotalOfAllMobs = 0;
    const mobsPresent = allMobs.length > 0;
    if (mobsPresent) {
      for (const mob of allMobs) {
        const { creatureName, mobSize } = mob;
        const creaturePowerlevel = await getCreaturePowerlevel(creatureName);
        const mobPowerlevel = mobSize * creaturePowerlevel;
        powerlevelTotalOfAllMobs += mobPowerlevel;
        console.log(`
          creatureName:${creatureName}
          mobSize:${mobSize}
          creaturePowerlevel:${creaturePowerlevel}
          mobPowerlevel:${mobPowerlevel}
          new powerlevelTotalOfAllMobs: ${powerlevelTotalOfAllMobs}
          `);
      }
    }
    return powerlevelTotalOfAllMobs;
  };
  const getAllLeveledNPCsPowerlevel = (allLeveledNPCs: LeveledNPC[]) => {
    let allLeveledNPCsPowerlevel = 0;
    const leveledNPCsPresent = allLeveledNPCs.length > 0;
    if (leveledNPCsPresent) {
      for (const leveledNPC of allLeveledNPCs) {
        const { level } = leveledNPC;
        const powerlevel = powerlevelByPlayerLevel[level];
        allLeveledNPCsPowerlevel += powerlevel;
        console.log(`
        leveledNPC:${leveledNPC.name}
        level:${level}
        new allLeveledNPCsPowerlevel: ${allLeveledNPCsPowerlevel}
        `);
      }
    }
    return allLeveledNPCsPowerlevel;
  };
  
  const difficulty = async () => {
    const powerlevelTotalOfAllMobs = await getAllMobsPowerlevel(allMobs);
    const allLeveledNPCsPowerlevel = getAllLeveledNPCsPowerlevel(allLeveledNPCs);
    const partyPowerlevel: number = getPartyPowerlevel(party);
    const difficultyValue: number =
      (powerlevelTotalOfAllMobs + allLeveledNPCsPowerlevel) / partyPowerlevel;
  
    let description = "";
    if (difficultyValue <= 0.4) {
      description = "easy";
    } else if (difficultyValue <= 0.6) {
      description = "medium";
    } else if (difficultyValue <= 0.8) {
      description = "hard";
    } else if (difficultyValue <= 1) {
      description = "deadly";
    } else if (difficultyValue > 1) {
      description = "absurd";
    }
    return `
    partyPowerlevel:${partyPowerlevel}
    powerlevelTotalOfAllMobs:${powerlevelTotalOfAllMobs}
    leveledNPCsPowerlevel:${allLeveledNPCsPowerlevel}
    difficulty: ${description} (${difficultyValue * 100}%)
    `;
  };
  
  const main = async () => {
    const result = await difficulty();
    console.log(result);
  };
  main();
  
