# @repo/env

> 🇬🇧 [English](./README.md)

Monorepo için merkezi ortam değişkeni doğrulaması. `@t3-oss/env-core`'dan `createEnv`'i ve Zod'dan `z`'yi yeniden dışa aktarır; böylece uygulamalar ortam doğrulaması için tek bir import kullanır.

## Export'lar

```ts
import { createEnv, z } from '@repo/env';
```

- **`createEnv`** — `@t3-oss/env-core`'dan gelen tipli ortam doğrulama fonksiyonu
- **`z`** — Zod şema oluşturucu (kolaylık için yeniden dışa aktarılır)

## Kullanım

Her uygulama kendi doğrulanmış ortam nesnesini oluşturur:

```ts
// apps/honojs/src/env.ts
import { createEnv, z } from '@repo/env';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3001),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().default('./data/dev.db'),
  },
  runtimeEnv: process.env,
});
```

> **Not:** Next.js uygulaması bu paket yerine `@t3-oss/env-nextjs`'i doğrudan kullanır, çünkü `NEXT_PUBLIC_` ön ek zorunluluğu ve istemci/sunucu ayrımı gerektirir.

## Betikler

| Betik | Açıklama |
|-------|----------|
| `pnpm build` | `tsup` ile derle |
| `pnpm dev` | İzleme modunda derle |
| `pnpm lint` | ESLint çalıştır |
| `pnpm check-types` | `tsc --noEmit` ile tip kontrolü yap |
