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