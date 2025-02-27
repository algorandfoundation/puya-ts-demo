# Puya-ts demo

## Getting started

### 1. Install npm deps

```shell
npm i
```

### 2. Ensure you have `puya.exe` available on your PATH

> This assumes you have a python installation on your machine, if not see algokit install instructions

```shell
pipx install puyapy
```

> puya.exe is currently distributed under the puyapy package but will eventually be moved to a puya package.

### 3. Test that puya is available (you may need to restart your shell)

```shell
puya --version
```

Puya 4.4.2 or later is required, so we expect to see the following

> puya 4.4.2

### 4. Build project

Using the npm script

```shell
npm run build:puya
```

OR

Invoke using npx

```shell
npx @algorandfoundation/puya-ts build contracts
```
