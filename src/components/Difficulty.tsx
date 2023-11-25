import { formatDifficultyOutput, getDifficulty } from "../domain"

export const Difficulty = () => {
    const difficulty = getDifficulty()
    const formatedDifficulty = formatDifficultyOutput(difficulty)
return (
    <div>difficulty: {JSON.stringify(formatedDifficulty.difficulty)}</div>
)
}