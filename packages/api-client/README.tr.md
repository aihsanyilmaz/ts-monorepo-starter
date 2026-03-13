# @repo/api-client

> 🇬🇧 [English](./README.md)

[Hono RPC](https://hono.dev/docs/guides/rpc) ile çalışan, Hono API için tip güvenli HTTP istemcisi.

## Export'lar

```ts
import { createApiClient, type AppType } from '@repo/api-client';
```

- **`createApiClient(baseUrl)`** — tipli bir Hono RPC istemcisi oluşturur. Hono uygulamasının `AppType` tipinden tam rota çıkarımı yapan bir istemci döndürür.
- **`AppType`** — API'nin rota yapısını temsil eden, `@repo/honojs`'den yeniden dışa aktarılan tip.

## Kullanım

```ts
import { createApiClient } from '@repo/api-client';

const api = createApiClient('http://localhost:3001');

// Tamamen tipli — rotalar, parametreler, istek gövdeleri ve yanıtlar
const res = await api.users.$get();
const data = await res.json();
```

## Nasıl Çalışır

Bu paket, `AppType` tipini `@repo/honojs`'den bir workspace bağımlılığı olarak içe aktarır (çalışma zamanında yalnızca tip düzeyinde). Hono'nun `hc` istemcisi bu tipi kullanarak tüm mevcut rotaları ve bunların istek/yanıt yapılarını çıkarır — kod üretimi gerekmez.

Turborepo pipeline'ı, `^build` bağımlılığı sayesinde `@repo/honojs`'nin önce derlenmesini sağlar.

## Betikler

| Betik | Açıklama |
|-------|----------|
| `pnpm build` | `tsup` ile derle |
| `pnpm dev` | İzleme modunda derle |
| `pnpm lint` | ESLint çalıştır |
| `pnpm check-types` | `tsc --noEmit` ile tip kontrolü yap |
