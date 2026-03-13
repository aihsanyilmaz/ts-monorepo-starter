# @repo/eslint-config

> 🇬🇧 [English](./README.md)

Monorepo için paylaşılan [ESLint](https://eslint.org/) flat yapılandırması.

## İçerik

Varsayılan dışa aktarım şunları birleştirir:

- `@eslint/js` önerilen kurallar
- `typescript-eslint` önerilen kurallar
- `eslint-config-prettier` (Prettier ile çakışan biçimlendirme kurallarını devre dışı bırakır)
- `eslint-plugin-turbo` önerilen kurallar
- `dist/`, `node_modules/`, `.next/`, `.turbo/` için genel yoksaymalar

## Kullanım

Herhangi bir çalışma alanının `eslint.config.mjs` dosyasında:

```js
import config from '@repo/eslint-config';

export default [
  ...config,
  // Çalışma alanına özel geçersiz kılmaları buraya ekleyin
];
```

## Betikler

| Betik | Açıklama |
|-------|----------|
| `pnpm lint` | Bu paketin kendisini denetle |
