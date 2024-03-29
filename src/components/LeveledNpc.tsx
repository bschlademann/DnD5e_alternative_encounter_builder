import { useContext, useState } from "react";
import { getRange } from "../lib";
import { CreaturesByIdContext, MobsContext, NpcsByIdContext } from "../contexts";
import { getPowerlevelByCr } from "../domain";

export type TLeveledNpc = { name: string; level: number };
export type NpcById = { [id: string]: TLeveledNpc };
export type LeveledNpcProps = {
  id: string;
  name: string;
  level: number;
};

// export const LeveledNpc = ({ id }: LeveledNpcProps) => {
//   // continue here please
//   const [npcById, setNpcById] = useContext(NpcsByIdContext);

//   const validLevels = getRange([1, 20]);

//   const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newLevel = parseInt(e.target.value);
//     setLeveledNpc((prevLeveledNpc) => {
//       return { ...prevLeveledNpc, level: newLevel };
//     });
//   };

//   const handelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newName = e.target.value;
//     setLeveledNpc((prevLeveledNpc) => {
//       return { ...prevLeveledNpc, name: newName };
//     });
//   };

//   const addToMobslist = (e: React.MouseEvent<HTMLButtonElement>) => {
//     // add NPC to MobList
//   };

//   const addToParty = (e: React.MouseEvent<HTMLButtonElement>) => {
//     // add NPC to Party
//   };

//   return (
//     <>
//       <label htmlFor="leveled-npc-name">name</label>
//       <input
//         type="text"
//         name="leveled-npc-name"
//         id="leveled-npc-name"
//         value={leveledNpc.name}
//         onChange={handelNameChange}
//       />

//       <label htmlFor="leveled-npc-level">level</label>
//       <select id="leveled-npc-level" onChange={handleLevelChange}>
//         {validLevels.map((validLevel) => (
//           <option value={validLevel} key={`level-${validLevel}`}>
//             {validLevel}
//           </option>
//         ))}
//       </select>

//       <button onClick={addToMobslist}>
//         <s>add to Mobslist</s>
//       </button>

//       <button onClick={addToParty}>
//         <s>add to Party</s>
//       </button>
//     </>
//   );
// };

export const LeveledNpc = () => {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [lastId, setId] = useState(0);
  const [mobs, setMobs] = useContext(MobsContext);

  const validLevels = getRange([1, 20]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLevel = parseInt(e.target.value);
    setLevel(newLevel);
  };

  const handelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
  };

  const getNextLeveledNpcId = () => {
    const id = lastId + 1;
    setId(id);
    return `leveled-npc-${id}`;
  };

  const addToMobslist = (e: React.MouseEvent<HTMLButtonElement>) => {
    // add NPC to MobList
    /* needs MobsContext to add NPC to Mobs 
    also needs to get id here
    */

  //   type MobsState = {
  //     [creatureId: string]: {
  //         creatureName: string;
  //         mobSize: number;
  //     };
  // }

   const id = getNextLeveledNpcId();

  //  FIXME: 
  //  das problem ist, dass CR/PEL nicht direkt in dem Objekt steht
  // der wert wird aus CreaturesById gezogen
  //  d.h. beim adden einer creature aus creaturesById in mobs müsste der CR wert in PEL umgerechnet mit in übergeben werden
  // sonst kann die Berechnung zusammen mit leveledNpcs nciht klappen
  //  alternativ könnte man auch die NPCs in creaturesById adden und dann die berechnung weiter so lassen
  // bessere lösung: add NPC to creaturesById, dann zu mobs adden mit mobsize: 1
  // das spart eine menge refactoring 
  const powerlevel = getPowerlevelByCharacter
   setMobs(prevMobs => ({...prevMobs, [id]: {creatureName: name, mobSize: 1, powerlevel}}))
   
  };

  const addToParty = (e: React.MouseEvent<HTMLButtonElement>) => {
    // add NPC to Party
  };

  return (
    <>
      <label htmlFor="leveled-npc-name">name</label>
      <input
        type="text"
        name="leveled-npc-name"
        id="leveled-npc-name"
        value={name}
        onChange={handelNameChange}
      />

      <label htmlFor="leveled-npc-level">level</label>
      <select id="leveled-npc-level" onChange={handleLevelChange}>
        {validLevels.map((validLevel) => (
          <option value={validLevel} key={`level-${validLevel}`}>
            {validLevel}
          </option>
        ))}
      </select>

      <button onClick={addToMobslist}>
        <s>add to Mobslist</s>
      </button>

      <button onClick={addToParty}>
        <s>add to Party</s>
      </button>
    </>
  );
};
