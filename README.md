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