# @repo/shared

> 🇬🇧 [English](./README.md)

Uygulamalar arasında paylaşılan Zod şemaları ve TypeScript tipleri. Bu paket, döngüsel bağımlılıkları önlemek amacıyla `@repo/db`'den bilinçli olarak bağımsız tutulmuştur.

## Dışa Aktarımlar

```ts
import { UserSchema, type User, ApiResponseSchema, type ApiResponse } from '@repo/shared';
```

### `UserSchema` / `User`

Kullanıcı nesnesi için Zod şeması ve çıkarımlanan tip:

```ts
{
  id: string;
  name: string;       // en az 1 karakter
  email: string;      // geçerli e-posta
  createdAt: string;  // ISO tarih-saat
}
```

### `ApiResponseSchema` / `ApiResponse`

Genel API yanıt sarmalayıcısı. `ApiResponseSchema`, parametre olarak bir Zod veri şeması alan bir fabrika fonksiyonudur:

```ts
const ResponseSchema = ApiResponseSchema(UserSchema);

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};
```

## Betikler

| Betik | Açıklama |
|-------|----------|
| `pnpm build` | `tsup` ile derle |
| `pnpm dev` | İzleme modunda derle |
| `pnpm lint` | ESLint çalıştır |
| `pnpm check-types` | `tsc --noEmit` ile tip kontrolü yap |
