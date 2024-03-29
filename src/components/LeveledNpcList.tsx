import { useContext, useState } from "react";

import { LeveledNpc } from "./LeveledNpc";
import { NpcsByIdContext } from "../contexts";

export const LeveledNpcList = () => {
  // const [npcById, setNpcById] = useContext(NpcsByIdContext);
  const [leveledNpcList, setLeveledNpcList] = useState([]);
  const [lastId, setId] = useState(0);

  const getNextLeveledNpcId = () => {
    const id = lastId + 1;
    setId(id);
    return `leveled-npc-${id}`;
  };

  // const addLeveledNpc = () => {
  //   const newId = getNextLeveledNpcId();
  //   setNpcById(npcsById => ({...npcsById, [newId]: { id: newId, name: "", level: 1 }}))
  // };

  // leveledNpcList should look like this:
  // {[id: string]: {name: string, level: number}}
  // updating each instance of LeveledNpc:

  const updateNpcLevelById = (id: string, newLevel: number) => {
    setNpcById((prevLeveledNpcList) => {
      const index = prevLeveledNpcList.findIndex((npc) => npc.id === id);
      if (index === -1) return prevLeveledNpcList;
      const newList = [...prevLeveledNpcList];
      newList[index] = { ...newList[index], level: newLevel };
      return newList;
    });
  };
  // Object.keys
  // Object.entries
  // Object.values

  // return (
  //   <div className="leveled-npc-list">
  //     <button onClick={addLeveledNpc}>Add leveled NPC</button>
  //     {Object.values(npcById).map((npc) => {
  //       return (
  //           <LeveledNpc key={npc.id} {...npc} />
  //       );
  //     })}
  //   </div>
  // );

  const addLeveledNpc = (e: React.MouseEvent<HTMLButtonElement>) => {
    //
  };

  return (
    <>
      <div className="leveled-npc-list">
        <input type="text" placeholder="NPC name" />
        <select name="" id=""></select>

        <button>add to mobsList</button>
        {/* needs PartyContext to add NPC to Party */}
        {/* restructure party state structure and party powerLevel calculation logic to be able 
        to handle stuctures like creature/npc objects instead of only a number of players and their collective level
        */}
        <button>add to party</button>
        {/* <button onClick={addLeveledNpc}>add leveled NPC</button> */}
      </div>
    </>
  );
};
