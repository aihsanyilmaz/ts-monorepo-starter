# ts-monorepo-starter

**pnpm workspaces** ve **Turborepo** ile yönetilen full-stack TypeScript monorepo şablonu. Bir API sunucusu, bir web uygulaması, bir mobil uygulama — sıfır codegen ile tip güvenli API çağrıları paylaşır.

**Teknoloji:** TypeScript · pnpm · Turborepo · Hono · Next.js · Expo · Drizzle ORM · SQLite · Zod · Tailwind CSS · shadcn/ui · Docker

> 🇬🇧 [English README](./README.md)

## Hızlı Başlangıç

```bash
git clone <your-repo-url> my-app
cd my-app
pnpm install
pnpm dev
```

| Uygulama      | URL                     |
|---------------|-------------------------|
| Next.js       | http://localhost:3000    |
| Hono API      | http://localhost:3001    |
| Expo (web)    | http://localhost:8081    |

`.env` dosyası gerekmez — varsayılan değerler yerleşiktir.

## Proje Yapısı

```
├── apps/
│   ├── honojs/           # REST API (Hono + SQLite + Drizzle ORM)
│   ├── nextjs/           # Web uygulaması (Next.js + Tailwind + shadcn/ui)
│   └── react-native/     # Mobil + web uygulaması (Expo)
├── packages/
│   ├── eslint-config/    # Paylaşılan ESLint flat config'leri
│   └── typescript-config/ # Paylaşılan tsconfig tabanları
├── docker-compose.yml
├── docker-compose.prod.yml
├── pnpm-workspace.yaml
└── turbo.json
```

**3 uygulama, 2 config paketi.** Her uygulama kendi bağımlılıkları, tipleri ve veritabanı kurulumu ile bağımsızdır. Config paketleri lint ve TypeScript ayarlarını workspace genelinde paylaşır.

## Uygulamalar

| Uygulama | Framework | Port | Açıklama |
|----------|-----------|------|----------|
| `apps/honojs` | [Hono](https://hono.dev/) | 3001 | Tipli RPC export'ları ile REST API. Drizzle ORM ile SQLite, Zod doğrulama, Drizzle migration'ları. |
| `apps/nextjs` | [Next.js](https://nextjs.org/) | 3000 | Tailwind CSS v4 ve shadcn/ui ile web uygulaması. Hono API'den uçtan uca tip güvenliğiyle veri çeker. |
| `apps/react-native` | [Expo](https://expo.dev/) | 8081 | Çapraz platform mobil uygulama. Next.js ile aynı tipli API istemcisi. |

## Tip Güvenli API Zinciri

Frontend uygulamalar Hono API'den `AppType` import eder ve `hono/client` ile tam tipli API çağrıları yapar — codegen yok, OpenAPI yok, sadece TypeScript çıkarımı:

```
apps/honojs (route tanımlar → AppType export eder)
    ↓ tip import
apps/nextjs, apps/react-native (hc<AppType> → tipli API istemcisi)
```

## Ortam Değişkenleri

Her uygulama kendi env şemasını [t3-env](https://env.t3.gg/) + Zod ile tanımlar. Geçersiz değişkenler anında başlatma hatası verir.

| Uygulama | Env Dosyası | Değişkenler |
|----------|-------------|-------------|
| `apps/honojs` | `.env.example` | `PORT` (3001), `NODE_ENV`, `DATABASE_URL` (./data/dev.db) |
| `apps/nextjs` | `.env` | `NEXT_PUBLIC_API_URL` (http://localhost:3001) |
| `apps/react-native` | `.env` | `EXPO_PUBLIC_API_URL` (http://localhost:3001) |

## Veritabanı

Hono API **SQLite**'ı Drizzle ORM ile kullanır. Schema, config ve migration'lar `apps/honojs/` içinde yaşar:

```
apps/honojs/
├── src/db/schema.ts      # Drizzle şeması (tablolar)
├── drizzle.config.ts     # Drizzle Kit config
└── drizzle/              # Oluşturulan migration dosyaları
```

Migration'lar uygulama başlatılırken otomatik çalışır. Schema değişikliğinden sonra yeni migration oluşturmak için:

```bash
cd apps/honojs
pnpm db:generate    # Schema diff'inden migration oluştur
pnpm db:studio      # Drizzle Studio'yu aç (tarayıcı arayüzü)
```

## Scriptler

### Root (Turborepo ile)

| Komut | Açıklama |
|-------|----------|
| `pnpm dev` | Tüm uygulamaları dev modunda başlat |
| `pnpm build` | Tüm uygulama ve paketleri derle |
| `pnpm lint` | Tüm workspace'leri lint'le |
| `pnpm check-types` | Tüm workspace'lerde tip kontrolü |
| `pnpm format` | Prettier ile formatla |

### Filtreleme

```bash
pnpm dev --filter honojs     # Sadece API'yi başlat
pnpm build --filter nextjs   # Sadece web uygulamasını derle
```

## Docker

İki uygulama containerize edilmiştir: **Hono API** ve **Next.js**. Expo mobil cihazları kendi araçlarıyla hedefler.

### Geliştirme

```bash
pnpm docker:dev
```

Kaynak dizinler hot-reload için volume olarak bağlanır. Yeniden derleme gerekmez.

### Production

```bash
pnpm docker:prod
```

Çok aşamalı Dockerfile'lar minimal Alpine image'ları üretir. Özellikler:
- Tüm servislerde sağlık kontrolleri
- `unless-stopped` yeniden başlatma politikası
- Next.js, Hono API sağlıklı olana kadar bekler
- SQLite verisi adlandırılmış Docker volume ile kalıcı

```bash
# Next.js client bundle için API URL'ini geçersiz kıl
NEXT_PUBLIC_API_URL=https://api.example.com pnpm docker:prod
```

## Mimari Notlar

### pnpm Catalog

Paylaşılan bağımlılık versiyonları `pnpm-workspace.yaml`'daki `catalog:` bloğunda sabitlenir. TypeScript, ESLint, Zod vb. güncellemek için tek bir yer.

### Neden Tipler/DB/Env için Paylaşılan Paket Yok?

Bilinçli bir tercih. Küçük wrapper'lar (`createEnv`, `hc<AppType>`) kendi build config'leri ve tsconfig'leri olan ayrı paketlerin yükünü hak etmez. Her uygulama ihtiyacını doğrudan import eder. Paylaşılan tek paketler config'lerdir (ESLint, TypeScript) — bunlar gerçekten tekrarı azaltır.

## Lisans

MIT
