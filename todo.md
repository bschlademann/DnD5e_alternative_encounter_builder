# components
- {CreatureSelector}:
  - refactor mobs-state: Array -> Map or Object
  - table: {addButton}, {substractButton}, create.name, creature.cr
    - scrollable, max size: {window.height - input.height}
    - {addbutton} / {substractButton} add/remove mobs and in-/decrease mobsize in {mobs}-state
    - use table-heads for sorting entries, indicate via symbols in heads
- Party
  - add-button if not all PCs are of same level

# fix
- handle empty party array more gracefully
- hash table with creature names for faster search
- build front-end
? increase accuracy further with more concrete data 
    - import character sheet data from foundry vtt
    - use hp/ac/dmg of character sheets and creature data for calculation instead of just CR

