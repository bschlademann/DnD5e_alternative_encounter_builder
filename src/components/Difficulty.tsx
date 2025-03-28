import "./Difficulty.css";
import { formatDifficultyOutput, getDifficulty } from "../domain";

export const Difficulty = () => {
  const difficulty = getDifficulty();
  const formatedDifficulty = formatDifficultyOutput(difficulty);
  return (
    <div className="difficulty">
      <div className="left">
        <h2>Difficulty</h2>
      </div>
      <div className="right">{formatedDifficulty.difficulty}</div>
    </div>
  );
};
