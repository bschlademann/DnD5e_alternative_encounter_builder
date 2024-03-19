import { useContext } from "react";

import { LeveledNpc, TLeveledNpc } from "./LeveledNpc";
import { LeveledNpcListContext } from "../contexts";

export const LeveledNpcList = () => {
  const [leveledNpcList, setLeveledNpcList] = useContext(LeveledNpcListContext);

  const getNextLeveledNpcId = (leveledNpcList: TLeveledNpc[]) => {
    const highestId = leveledNpcList.reduce((maxId, leveledNpc) => {
      const idParts = leveledNpc.id.split("-");
      const currentIdNum = parseInt(idParts[idParts.length - 1], 10);
      return Math.max(maxId, currentIdNum);
    }, 0);
    return `leveled-npc-${highestId + 1}`;
  };

  const addLeveledNpc = () => {
    const newId = getNextLeveledNpcId(leveledNpcList);
    const newLeveledNpc = { id: newId, name: "", level: 1 };
    setLeveledNpcList([...leveledNpcList, newLeveledNpc]);
  };
  

  return (
    <div className="leveled-npc-list">
      <button onClick={addLeveledNpc}>add leveled NPC</button>
      {leveledNpcList.map((leveledNpc) => {
        return (
            <LeveledNpc key={leveledNpc.id} {...leveledNpc} />
        );
      })}
    </div>
  );
};
