- create list of bestiaryFileNames on LOCAL
- fetch list of bestiary file names from SERVER
- exclude "-ua-" files
- compare SERVERlist with LOCALlist
```ts
const newBestiaries = SERVERlist.map(bestiary => {if (!LOCALlist.includes(bestiary)) => bestiary})
if (!exists(file)) {
let newBestiaries = []
fetch file and write to bestiary folder
newBestiaries.push(file)
newBestiaries.map check if creatures already exists in creatureMasterList, if not, add them
}

// parse bestiary files into new object: Bestiary
for faster access
type Bestiary = {
  name: string;
  cr?: string; // maybe parse to number before
  source?: string[];
}[];
```