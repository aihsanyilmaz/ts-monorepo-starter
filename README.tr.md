# ts-monorepo-starter

**pnpm workspaces** ve **Turborepo** ile yönetilen full-stack TypeScript monorepo şablonu. İki backend seçeneği (Hono ve NestJS), bir Next.js web uygulaması ve bir Expo React Native uygulaması içerir — hepsi veritabanı erişimi, ortam değişkeni doğrulama, API istemcisi ve iş mantığı için ortak tipli paketleri paylaşır.

**Teknoloji:** TypeScript · pnpm · Turborepo · Hono · NestJS · Next.js · Expo · Drizzle ORM · SQLite · Zod · Tailwind CSS · shadcn/ui · Docker

> 🇬🇧 [English README](./README.md)

## Hızlı Başlangıç

```bash
git clone <repo-url> ts-monorepo-starter
cd ts-monorepo-starter
pnpm install

# Tüm uygulamaları geliştirme modunda başlat
pnpm dev
```

Bu kadar. Dört uygulama da varsayılan ayarlarla başlar — geliştirme için `.env` dosyası gerekmez:

| Uygulama      | URL                     |
|---------------|-------------------------|
| Next.js       | http://localhost:3000    |
| Hono API      | http://localhost:3001    |
| NestJS API    | http://localhost:3002    |
| Expo (web)    | http://localhost:8081    |

> **Not:** Backend uygulamalar (Hono, NestJS) `.env.example` dosyaları içerir. Varsayılan değerler env doğrulama katmanına dahildir, bu yüzden `pnpm dev` kutudan çıktığı gibi çalışır. `.env.example` dosyasını `.env` olarak kopyalayın yalnızca varsayılanları değiştirmek istediğinizde.

## Proje Yapısı

```
├── apps/
│   ├── honojs/           # Hafif REST API (Hono + Node.js adaptörü)
│   ├── nestjs/           # Kurumsal REST API (NestJS + SWC)
│   ├── nextjs/           # Web uygulaması (Next.js + Tailwind + shadcn/ui)
│   └── react-native/     # Mobil + web uygulaması (Expo SDK)
├── packages/
│   ├── api-client/       # Tip güvenli Hono RPC istemcisi
│   ├── db/               # Drizzle ORM — SQLite (varsayılan) veya PostgreSQL
│   ├── env/              # Zod tabanlı env doğrulama (createEnv + z)
│   ├── eslint-config/    # Paylaşılan ESLint flat config'ler
│   ├── shared/           # Paylaşılan tipler, şemalar ve yardımcılar
│   └── typescript-config/ # Paylaşılan tsconfig tabanları
├── docker-compose.yml      # Geliştirme container'ları (hot-reload)
├── docker-compose.prod.yml # Production container'ları (multi-stage build)
├── pnpm-workspace.yaml     # Workspace + versiyon kataloğu
├── turbo.json              # Turborepo pipeline yapılandırması
└── package.json            # Kök betikler
```

## Uygulamalar

| Uygulama | Framework | Port | Açıklama |
|----------|-----------|------|----------|
| `apps/honojs` | [Hono](https://hono.dev/) | 3001 | Tipli RPC export'ları ile hafif REST API. `@hono/node-server` adaptörü, veri erişimi için Drizzle ORM ve istek doğrulama için Zod kullanır. |
| `apps/nestjs` | [NestJS](https://nestjs.com/) | 3002 | Dekoratör tabanlı DI ile kurumsal düzeyde REST API. Geliştirme modunda SWC (`--watch`), production build'lerinde tsc kullanır. |
| `apps/nextjs` | [Next.js](https://nextjs.org/) | 3000 | Tailwind CSS v4 ve shadcn/ui bileşenleri ile web uygulaması. Tipli `@repo/api-client` aracılığıyla Hono API'den veri çeker. |
| `apps/react-native` | [Expo](https://expo.dev/) | 8081 | Web çıktısı ile çapraz platform mobil uygulama. Geliştirme için Expo SDK ve `expo start --web` kullanır. |

## Paketler

| Paket | Amaç |
|-------|------|
| `@repo/api-client` | Tip güvenli Hono RPC istemcisi — codegen olmadan uçtan uca tip güvenliği için `apps/honojs`'den `AppType` import eder. |
| `@repo/db` | Drizzle ORM ile çift sürücü desteği — SQLite (varsayılan, sıfır yapılandırma) veya PostgreSQL. Geçiş için `DB_DRIVER=pg` ayarlayın. |
| `@repo/env` | `@t3-oss/env-core`'dan `createEnv` ve Zod'dan `z`'yi yeniden export eder. Her uygulama bu temel öğeleri kullanarak kendi env şemasını tanımlar. |
| `@repo/shared` | Paylaşılan TypeScript tipleri, Zod şemaları, sabitler ve yardımcı fonksiyonlar. |
| `@repo/eslint-config` | ESLint flat config ön ayarları: `base`, `library`, `react`, `next`. |
| `@repo/typescript-config` | Paylaşılan `tsconfig.json` tabanları: `base`, `library`, `react`, `next`. |

## Ortam Değişkenleri

Bu şablon **Zod tabanlı, erken-hata** env doğrulama deseni kullanır:

1. `@repo/env`, `createEnv` ve `z`'yi tek bir import olarak sağlar
2. Her uygulama kendi env şemasını tanımlar (ör. `apps/honojs/src/env.ts`)
3. Geçersiz veya eksik env değişkenleri, açık bir hata mesajıyla anında başlatma hatası verir

Backend uygulamalar (Hono, NestJS) tüm env değişkenleri için **varsayılan değerlere** sahiptir — `.env` dosyası olmadan çalışırlar. Her uygulamanın `.env.example` dosyasında mevcut değişkenler:

| Uygulama | Env Dosyası | Değişkenler |
|----------|-------------|-------------|
| `apps/honojs` | `.env.example` | `PORT` (3001), `NODE_ENV` (development), `DB_DRIVER` (sqlite), `DATABASE_URL` (./data/dev.db) |
| `apps/nestjs` | `.env.example` | `PORT` (3002), `NODE_ENV` (development), `DB_DRIVER` (sqlite), `DATABASE_URL` (./data/dev.db) |
| `apps/nextjs` | `.env.example` | `NEXT_PUBLIC_API_URL` (http://localhost:3001) |
| `apps/react-native` | `.env.example` | `EXPO_PUBLIC_API_URL` (http://localhost:3001) |

Next.js, `NEXT_PUBLIC_` prefix zorunluluğu ile `@t3-oss/env-nextjs` kullanır. Expo, `EXPO_PUBLIC_` prefix ile `@t3-oss/env-core` kullanır.

## Betikler

### Kök Seviye (Turborepo ile)

| Komut | Açıklama |
|-------|----------|
| `pnpm dev` | Tüm uygulamaları geliştirme modunda başlat (watch/HMR) |
| `pnpm build` | Tüm uygulama ve paketleri derle |
| `pnpm lint` | Tüm workspace'leri lint'le |
| `pnpm check-types` | Tüm workspace'lerin tip kontrolünü yap |
| `pnpm format` | Prettier ile tüm dosyaları formatla |
| `pnpm format:check` | Yazmadan formatlamayı kontrol et |

### Docker

| Komut | Açıklama |
|-------|----------|
| `pnpm docker:dev` | Geliştirme container'larını başlat (volume mount ile hot-reload) |
| `pnpm docker:prod` | Production container'larını derle ve başlat |
| `pnpm docker:prod:detach` | Yukarıdakinin aynısı, arka plan modunda |
| `pnpm docker:down` | Geliştirme container'larını durdur |
| `pnpm docker:prod:down` | Production container'larını durdur |

### Filtreleme

Turborepo'nun `--filter` özelliğiyle belirli bir workspace için komut çalıştırın:

```bash
pnpm dev --filter honojs          # Sadece Hono API'yi başlat
pnpm build --filter @repo/shared  # Sadece shared paketini derle
pnpm lint --filter nextjs         # Sadece Next.js uygulamasını lint'le
```

## Docker

Üç uygulama container'a alınmıştır: **Hono**, **NestJS** ve **Next.js**. React Native (Expo) dahil değildir — mobil cihazları ve web'i Expo'nun kendi araçlarıyla hedefler.

### Geliştirme

```bash
pnpm docker:dev
```

`docker-compose.yml` kullanır. Kaynak dizinler volume olarak bağlanır, böylece kod değişiklikleri container içinde hot-reload'u tetikler. Geliştirme sırasında yeniden derleme gerekmez.

| Servis  | Container Portu | Host Portu |
|---------|----------------|------------|
| honojs  | 3001           | 3001       |
| nestjs  | 3002           | 3002       |
| nextjs  | 3000           | 3000       |

### Production

```bash
pnpm docker:prod
```

`docker-compose.prod.yml` kullanır. Her uygulama minimal image'lar üreten **multi-stage Dockerfile'lar** ile derlenir:

| Image | Boyut | Taban |
|-------|-------|-------|
| `repo-nextjs` | ~74 MB | `node:22-alpine` (standalone çıktı) |
| `repo-honojs` | ~101 MB | `node:22-alpine` |
| `repo-nestjs` | ~108 MB | `node:22-alpine` |

Production özellikleri:
- **Multi-stage build** — ayrı install, build ve runtime aşamaları; geliştirme bağımlılıkları son image'dan çıkarılır
- **Standalone Next.js** — `next.config.ts`'de `output: 'standalone'` yalnızca gerekli olanı paketler
- **Sağlık kontrolleri** — tüm servislerde Docker `HEALTHCHECK` ile `/api/health` endpoint'leri
- **Yeniden başlatma politikası** — otomatik kurtarma için `unless-stopped`
- **Bağımlılık sıralaması** — Next.js, başlamadan önce Hono API'nin sağlıklı olmasını bekler
- **Kalıcı veri** — PostgreSQL verisi adlandırılmış Docker volume'larında saklanır

### Build Argümanları

Next.js, build zamanında `NEXT_PUBLIC_API_URL` gerektirir (istemci bundle'ına gömülür):

```bash
docker compose -f docker-compose.prod.yml build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com
```

Veya ortam değişkeni ile ayarlayın (compose dosyasında `http://localhost:3001` varsayılanı vardır):

```bash
NEXT_PUBLIC_API_URL=https://api.example.com pnpm docker:prod
```

### Tek Tek Image Derleme

```bash
# Repo kökünden (context monorepo kökü olmalıdır)
docker build -f apps/honojs/Dockerfile -t repo-honojs .
docker build -f apps/nestjs/Dockerfile -t repo-nestjs .
docker build -f apps/nextjs/Dockerfile -t repo-nextjs --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 .
```

## Mimari Notlar

### pnpm Kataloğu

Tüm paylaşılan bağımlılık versiyonları `pnpm-workspace.yaml`'daki tek bir `catalog:` bloğunda sabitlenir. Workspace paketleri, sabit semver yerine `"catalog:"` ile versiyonlara referans verir — TypeScript, ESLint, Zod vb. güncellemek için tek bir yer.

### Hono RPC Tip Zinciri

`@repo/api-client`, `apps/honojs`'den `AppType` import eder ve tipli bir Hono RPC istemcisi oluşturur. Bu, frontend uygulamalara API çağrıları için uçtan uca tip güvenliği sağlar — codegen yok, OpenAPI yok, sadece sunucu route'larından TypeScript çıkarımı.

```
apps/honojs (route'lar + AppType tanımlar)
    ↓ tip export
packages/api-client (tipli hono/client oluşturur)
    ↓ kullanılır
apps/nextjs, apps/react-native
```

### NestJS Derleme Stratejisi

- **Geliştirme:** `node --watch --import @swc-node/register/esm-register` — SWC, dekoratör metadata desteğiyle TypeScript'i anında derler
- **Derleme:** `tsc` — esbuild/tsup dekoratör metadata'yı çıkarır, bu yüzden production build'lerinde tsc kullanılır

### Docker Derleme Stratejisi

Tüm Dockerfile'lar aynı 4 aşamalı kalıbı izler:

1. **base** — corepack ile pnpm etkinleştirilmiş Alpine Node.js
2. **deps** — Yalnızca `package.json` dosyaları + lockfile kopyalanır, ardından `pnpm install --frozen-lockfile` (katman önbelleğini maksimize eder)
3. **build** — Kaynak kod kopyalanır, paketler bağımlılık sırasına göre derlenir
4. **production** — Yalnızca production bağımlılıkları + derlenmiş çıktı ile temiz image

Build context'i her zaman **monorepo kökü**dür (`docker build -f apps/xxx/Dockerfile .`) çünkü workspace paketlerinin ağaç boyunca çözümlenmesi gerekir.

### Veritabanı

Drizzle ORM ile çift sürücü desteği — **SQLite** (varsayılan) veya **PostgreSQL**.

**SQLite (varsayılan, sıfır yapılandırma):**
```bash
pnpm dev  # Doğrudan çalışır — SQLite dosyası otomatik oluşturulur
```

**PostgreSQL:**
```bash
# Seçenek 1: Docker (önerilen)
docker compose up  # PG + tüm uygulamaları otomatik başlatır

# Seçenek 2: Yerel PG
DB_DRIVER=pg DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb pnpm dev
```

Her iki sürücü için tablolar uygulama başlatılırken `CREATE TABLE IF NOT EXISTS` ile oluşturulur.

**Drizzle migration'ları** PostgreSQL şema değişiklikleri için mevcuttur:
```bash
pnpm db:generate:pg  # Şema değişikliklerinden migration oluştur
pnpm db:migrate:pg   # Migration'ları uygula (DATABASE_URL gerektirir)
pnpm db:studio:pg    # PG için Drizzle Studio'yu aç
```

Docker'da PostgreSQL verisi `postgres-data` adlandırılmış volume ile kalıcı hale getirilir.

## Lisans

MIT
