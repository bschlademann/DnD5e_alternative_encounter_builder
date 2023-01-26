## file and folder structure
// lib: general code, has nothing to do with your app (string manipulation, object transformations, array stuff)
// infrastructure: concrete database connection, request stuff from apis, code for reading 5e tools data, etc
// entry points: index.ts(x) / cli.ts, this is "first" file that runs (e.g. via vite, via node, etc)
// "domain" -> starts as one file, then lots of sub-folders

// const party2: Party2 = {
//   PLAYER_CHARACTERS_FINAL: "Player_1, Player_2, Player_3",
//   level: 3,
// };

// api.ts OR api/5e-tools.ts
// const get5eDataFromApi = async () => {
//  const data: Party2 = await getStuffFrom5e();
//  const myDomainData = parse5eData(data);
// }

// main.ts / index.ts / cli.ts
// const main = async () => {
//   const domainData = await get5eDataFromApi();
//   const coolStuff = calculateWithDomainData(domainData);
// }

// the evil outside world
// ----------- infrastructure -------------
// ^ the boundary of your app
// [ domain ]

// Party.ts / domain.ts / domain/Party.ts
// type Party

## development (wenn du lokal entwickelst)

```sh
# nodemon
nodemon index.ts # tsc --watch && node dist/index.js
# ts-node
ts-node index.ts # tsc && node dist/index.js
```

## production (was auf deinem server läuft)

```sh
npm run build
# scp ./dist root@1.1.1.1/app
# on your server:
node dist/index.js
```

## benennung

record / object / dictionary / associative array
array / list / vector



```js

declare function getParty(): Promise<Party>;

const handleError = (error: unknown): number => {
  if (error instanceof Error) {
    return 42;
  } else {
    return 90;
  }
}

export function foo(): Promise<number> {
  return Promise.resolve()
  .catch(handleError)
  .then(() => 42);
}

export async function bar(): Promise<number> {
    await Promise.resolve();
  return 42;
}

const main = async (): Promise<void> => {
  const creaturPowerlevel = await getCreaturePowerlevel('foo')
    .catch(handleError);
  const result2 = await foo()
    .catch(handleError);
}

```

## generator functions
```js
// function* = generator function
// async
async function* readFiles (creatureName: string) {
  for (const bestiaryFileName of allBestiaryFileNames) {
    const filePath = `./bestiary/${bestiaryFileName}`;
    yield await getJson(filePath);
  }
}

function* fileGenerator() {
  const files = ['a.txt', 'b.txt', 'c.txt', 'd.txt', 'e.txt'];
  while (true) {
    const file = files.pop() as string;
    files.unshift(file);
    yield file;
  }
}

const __fileGenerator = fileGenerator();
const getFile = () => __fileGenerator.next().value as string;

const file1 = getFile();
const file2 = getFile();
const file3 = getFile();
const file4 = getFile();
const file5 = getFile();
```

## workflow
// 1. parsen -> data types
// 2. logic on data types
// 3. output

## alle Daten, die von außen rein kommen IMMER validieren/parsen
```js
const bestiaryJsonSchema: z.ZodSchema<BestiaryJson> = z.object({
  monster: z.array(
    z.object({ 
        cr: z.string(), 
        name: z.string() 
    })
  ),
});
// validation
const isBestiaryJson = (u: unknown): u is BestiaryJson =>
  bestiaryJsonSchema.safeParse(u).success;
// parsing
const parseBestiaryJson = (u: unknown): BestiaryJson =>
  bestiaryJsonSchema.parse(u);
```