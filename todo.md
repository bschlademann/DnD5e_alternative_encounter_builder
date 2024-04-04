# fix
- {LeveledNpc}
  - error in handleBaseCrChange() at parseInt because state [baseCr] can be (and is initially) null
- {Moblist} & {MobsSelector} error because type added to state [mobs] is inconsistent: sometimes Mob, sometimes Creature

# feat
- row virtualization for MobsSelector
- add leveled NPCs to Party
- add creatures to party
- add modal explaining functionality

# refactor

# difficulty calculation logic
- handle empty party array more gracefully

# components
- {MobList}
  - render only when not empty

- {LeveledNpcsList}
  - render only when not empty

- {Party}
  - add-button to add multiple levels of PCs
    - remove number of already selected level from validLevels?

# design
- add shadcnUI
- add spinner on first fetch

## readme
- update when new functionalities are available

# maybe
- calculate actual CR (e.g. Quickling 1 -> 5)
- add alternate mode in component[Party]: instead of 2 selects add each character seperately with name and level
- increase accuracy further with more concrete data 
    - import character sheet data from foundry vtt
    - use hp/ac/dmg of character sheets and creature data for calculation instead of just CR


