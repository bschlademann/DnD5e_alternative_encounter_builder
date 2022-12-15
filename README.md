## D&D 5e combat difficulty calculator
only using the challenge ratings (CR) of creatures to estimate the difficulty of a combat encounter always has been kind of inaccurate, especially so with a rising number of participants. This is an attempt to estimate the difficulty more accurately. It still uses the number of creatures and their levels/challange ratings as a base, but those are transformed and used in a different formula than the classical one from 5e.
# use

enter values into 
- party = {
    playerCharacters: for now simply an array of character names
    level: for now assumes each character has the same level
}
- allMobs: use an object for each type of creature = [
    {
        creatureName: name of creature type, used when itterating over the bestiary-files
        mobSize: how many of that type are there
    }
]
- allLeveledNPCs: leveled characters that are used as opponents = [
    name: as this is arbitrary it's jsut for your reference and not used in any formula,
    level: total level of character class levels
]

currently there is no front-end and the results are simply logged in the console via
npm run dev

# to do:
- build front-end
? increase accuracy further with more concrete data 
    - import character sheet data from foundry vtt
    - use hp/ac/dmg of character sheets and creature data for calculation instead of just CR

# fix
- handle empty party array more gracefully
