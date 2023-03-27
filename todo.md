# styling
- layout
- design

# refactor
- remove name from state[mobs] -> state[mobsState] {ids: string[], byId: {[id: string]: number}}
  - get name from state[creatureById]
- parse creatureCR to PEL at the start & display PEL in table instead of CR

# difficulty calculation logic
- implement leveledNpcs: state, context, include in difficulty calculation

# components
- {MobsSelector}:
  - automatically sort list of creatures alphabetically on load
  - handle click on decrement-button for elements that are not present in state
  - use table-heads for sorting entries, indicate via symbols in heads

- {CustomCreature}
  - name, cr
  - add button
    - can only be clicked when name has value ({name} only accepts letters)

- {LeveledNpcs}
  - name, level
  - add button

- {LeveledNpcList}
  - display above {MobList}
  - clear button to remove all mobs from encounter

- {MobList}
  - clear button to remove all mobs from encounter

- {Party}
  - add-button to add multiple levels of PCs
    - remove number of already selected level from validLevels

## readme
- update when new functionalities are available

# maybe
? add alternate mode in copmpoent[Party]: instead of 2 selects add each character seperately with name and level
? increase accuracy further with more concrete data 
    - import character sheet data from foundry vtt
    - use hp/ac/dmg of character sheets and creature data for calculation instead of just CR


