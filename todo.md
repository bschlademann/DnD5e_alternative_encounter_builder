# design
- add shadcnUI

# feat
- row virtualization for MobsSelector

# refactor
- refactor state[creatures] from Array to Object
  - [creatureId: number]: {name: string, cr: number}

# difficulty calculation logic
- implement leveledNpcs: state, context, include in difficulty calculation
- handle empty party array more gracefully

# components
- {MobsSelector}:
  - handle click on decrement-button for elements that are not present in state
  - use table-heads for sorting entries, indicate via symbols in heads
  - FIXME: double entries (e.g. "Quickling")

- {MobList}
  - render only when not empty
  - add button "clear"

- {LeveledNpcs}

- {LeveledNpcsList}
  - render only when not empty
  - add button "clear"

- {Party}
  - add-button to add multiple levels of PCs
    - remove number of already selected level from validLevels

## readme
- update when new functionalities are available

# maybe
- calculate actual CR (e.g. Quickling 1 -> 5)
- add alternate mode in component[Party]: instead of 2 selects add each character seperately with name and level
- increase accuracy further with more concrete data 
    - import character sheet data from foundry vtt
    - use hp/ac/dmg of character sheets and creature data for calculation instead of just CR


