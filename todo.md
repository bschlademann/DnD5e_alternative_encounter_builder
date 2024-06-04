# fix
- set max height of all elements so they get scrollbars and have the gap set in /Layout.module.container below them
- CustomCreature: disable buttons addToMobsList and addToParty when no name is entered in the field and neither cr nor level is selected 
- Layout: all rolumns should be exactly the same width, but Mobs Selector is wider, Party is to narrow
- MobsList: get max-width on name field, otheriwse long names cause whole MobsList to widen

# feat
- row virtualization for MobsSelector
- add modal explaining functionality
- add clear/reload localStorage button to MobsSelector

# refactor

# components
- {MobList}
  - render only when not empty?

- {Party}
  - add-button to add multiple levels of PCs
    - remove number of already selected level from validLevels?

# design
- add spinner on (first fetch) loading the site, including all border elements

## readme
- update when new functionalities are available

# maybe
- calculate actual CR (e.g. Quickling 1 -> 5)
- add alternate mode in component[Party]: instead of 2 selects add each character seperately with name and level
- increase accuracy further with more concrete data 
    - import character sheet data from foundry vtt
    - use hp/ac/dmg of character sheets and creature data for calculation instead of just CR


