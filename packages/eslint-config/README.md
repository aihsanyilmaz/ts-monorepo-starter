# @repo/eslint-config

> 🇹🇷 [Türkçe](./README.tr.md)

Shared [ESLint](https://eslint.org/) flat config for the monorepo.

## What's Included

The default export combines:

- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-config-prettier` (disables formatting rules that conflict with Prettier)
- `eslint-plugin-turbo` recommended rules
- Global ignores for `dist/`, `node_modules/`, `.next/`, `.turbo/`

## Usage

In any workspace's `eslint.config.mjs`:

```js
import config from '@repo/eslint-config';

export default [
  ...config,
  // Add workspace-specific overrides here
];
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm lint` | Lint this package itself |
