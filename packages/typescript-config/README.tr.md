# @repo/typescript-config

> 🇬🇧 [English](./README.md)

Monorepo için paylaşılan [TypeScript](https://www.typescriptlang.org/) yapılandırmaları.

## Mevcut Yapılandırmalar

| Dosya | Kullanım Alanı | Temel Ayarlar |
|-------|----------------|---------------|
| `base.json` | Temel yapılandırma — diğerleri bunu genişletir | `strict`, `ESNext` modül, `bundler` çözümleme, bildirimler + kaynak haritaları |
| `node.json` | Node.js uygulamaları ve paketleri | `base.json`'ı `NodeNext` modül/çözümleme ile genişletir |
| `react.json` | React web kütüphaneleri | `base.json`'ı `jsx: "preserve"`, DOM kütüphaneleri ile genişletir |
| `nextjs.json` | Next.js uygulamaları | `react.json`'ı `allowJs`, `noEmit`, Next.js eklentisi ile genişletir |

## Kullanım

Bir çalışma alanının `tsconfig.json` dosyasında:

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

## Notlar

- Expo uygulaması, Metro'nun Expo'ya özgü ayarlar gerektirmesi nedeniyle (`jsx: "react-native"`, `module: "preserve"`) `react.json` yerine `expo/tsconfig.base` yapılandırmasını genişletir.
- Bu paketin derleme adımı yoktur — yalnızca JSON dosyaları yayınlar.
