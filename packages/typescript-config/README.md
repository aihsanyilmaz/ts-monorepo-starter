# @repo/typescript-config

Shared [TypeScript](https://www.typescriptlang.org/) configurations for the monorepo.

## Available Configs

| File | Use Case | Key Settings |
|------|----------|--------------|
| `base.json` | Foundation config — all others extend this | `strict`, `ESNext` module, `bundler` resolution, declarations + source maps |
| `node.json` | Node.js apps and packages | Extends `base.json` with `NodeNext` module/resolution |
| `react.json` | React web libraries | Extends `base.json` with `jsx: "preserve"`, DOM libs |
| `nextjs.json` | Next.js applications | Extends `react.json` with `allowJs`, `noEmit`, Next.js plugin |

## Usage

In a workspace's `tsconfig.json`:

```jsonc
{
  "extends": "@repo/typescript-config/node.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

## Notes

- The Expo app extends `expo/tsconfig.base` instead of `react.json` because Metro requires Expo-specific settings (`jsx: "react-native"`, `module: "preserve"`).
- This package has no build step — it only publishes JSON files.
