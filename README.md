## D&D 5e combat difficulty calculator
This is an attempt at estimating the difficulty of a combat encounter more accurately. Right now it still uses the challenge ratings (CR) of creatures and levels of players as input. Both are transformed into powerlevel equivalent values. The difficulty assigned to the encounter (trivial/easy/medium/hard/deadly/absurd) stems from the powerlevel equivalent of the party compared to that of the opposing side.

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

## credits
The idea of estimating the difficulty this way is not mine but unfortunately I am unable to find the source in my notes or online. I'm sure it was a post on enworld.com. If you know who the original author of this system is, please contact me so I can credit them here.

# to do:
- build front-end
? increase accuracy further with more concrete data 
    - import character sheet data from foundry vtt
    - use hp/ac/dmg of character sheets and creature data for calculation instead of just CR

# fix
- handle empty party array more gracefully
