type CreatureSelectorProps = {}
export const CreatureSelector = (props: CreatureSelectorProps) => {
    // use react context to avoid state drilling
    const {} = props;
    return (
        <div className="creature-selector">
            <input type="text" placeholder="enter creature name" value={}/>
        </div>
    )
} 