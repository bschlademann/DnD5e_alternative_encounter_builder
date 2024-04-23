import { formatDifficultyOutput, getDifficulty } from "../domain";

export const Difficulty = () => {
  const difficulty = getDifficulty();
  const formatedDifficulty = formatDifficultyOutput(difficulty);
  return (
    <div>
      <h2>
      Difficulty: 
      </h2>
      {formatedDifficulty.difficulty}
    </div>
  );
};
