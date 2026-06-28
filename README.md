# Check.it

App de **checklist de compras** em React Native / Expo. Este repositório está no
estágio de **bootstrap**: todas as bibliotecas de base estão instaladas e
configuradas, sem nenhuma feature/tela ainda — elas serão construídas em tarefas
seguintes.

## Stack

| Área | Escolha | Versão |
| --- | --- | --- |
| Base | Expo (managed + dev client) · Expo Router | SDK 56 |
| UI | NativeWind (Tailwind p/ RN) + react-native-reusables | NativeWind 4.2.x · Tailwind **3.4.x** |
| Animações | Reanimated + Gesture Handler | 4.3.x · 2.31.x |
| Estado | Zustand + AsyncStorage | 5.x · 2.2.x |
| Lint/Format | Biome | 2.4.x |
| Testes (unidade/integração) | jest-expo + Testing Library | jest **29** · RNTL 13 |
| Testes (E2E) | Detox + @config-plugins/detox | 20.51.x · 11.x |

### Pins importantes (compatibilidade)

- **Tailwind fica na v3** (`3.4.19`): NativeWind 4 ainda não suporta Tailwind v4.
- **Jest fica na v29**: o `jest-expo@56` é construído para o ecossistema jest 29.
- Dependências nativas seguem a versão escolhida pelo `expo install` (alinhada ao
  SDK 56), não necessariamente a "latest" do npm.

## Pré-requisitos

- **Node 20+** (ideal 22 LTS). O Expo SDK 56 não roda em Node 18.
  ```bash
  nvm use 22   # ou: nvm install 22
  ```
- **pnpm** (este projeto usa `node-linker=hoisted`, ver `.npmrc`).
- Para builds nativos / E2E: Xcode (iOS) e/ou Android SDK.

## Setup

```bash
pnpm install
pnpm start            # Metro / dev server
pnpm ios              # build + roda no simulador iOS (dev client)
pnpm android          # build + roda no emulador Android (dev client)
```

> O app usa Reanimated/Gesture Handler e um dev client, então **não roda no Expo
> Go** — use `pnpm ios` / `pnpm android` (ou um build EAS).

## Scripts

| Script | O que faz |
| --- | --- |
| `pnpm start` | Inicia o Metro |
| `pnpm ios` / `pnpm android` | Builda e roda o dev client |
| `pnpm lint` / `pnpm lint:fix` | Biome (check / autofix) |
| `pnpm format` | Biome formatter |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` / `pnpm test:watch` | Testes de unidade + integração (jest) |
| `pnpm e2e:prebuild` | Gera os projetos nativos (`expo prebuild`) |
| `pnpm e2e:build` / `pnpm e2e:test` | Detox no iOS (`ios.sim.debug`) |
| `pnpm e2e:build:android` / `pnpm e2e:test:android` | Detox no Android |

## Estrutura

```
src/
  app/            # rotas (Expo Router) — _layout.tsx + index.tsx (placeholder)
  lib/
    utils.ts      # cn() (clsx + tailwind-merge)
    theme.ts      # tokens de tema + NAV_THEME
  global.css      # diretivas Tailwind + CSS vars do tema
__tests__/        # testes de integração (fora de app/ p/ o router ignorar)
e2e/              # specs Detox + jest.config.js do E2E
components.json   # registry do react-native-reusables (CLI `add`)
tailwind.config.js · metro.config.js · babel.config.js · biome.json · .detoxrc.js
```

## UI: adicionando componentes (react-native-reusables)

O projeto já está configurado como um registry shadcn-style. Para adicionar um
componente (ele cai em `src/components/ui/`):

```bash
npx @react-native-reusables/cli@latest add button
```

Estilização via classes Tailwind (NativeWind) direto nos componentes RN:
`<View className="flex-1 items-center bg-background" />`.

## Estado + persistência (Zustand + AsyncStorage)

Padrão recomendado para stores persistidas (a ser usado nas features):

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useStore = create(
  persist((set) => ({ /* ... */ }), {
    name: 'checkit-store',
    storage: createJSONStorage(() => AsyncStorage),
  }),
);
```

## Animações

Reanimated + Gesture Handler já estão instalados e o `GestureHandlerRootView`
envolve o app em `src/app/_layout.tsx`. O `babel-preset-expo` (SDK 56) configura
o plugin de worklets automaticamente — **não** adicione `react-native-worklets/plugin`
manualmente ao Babel.

## E2E (Detox)

Detox precisa de um build nativo (não roda no Expo Go). Fluxo no iOS:

```bash
# pré-requisito (uma vez): brew tap wix/brew && brew install applesimutils
pnpm e2e:prebuild          # gera ios/ (e roda pod install)
pnpm e2e:build             # detox build (ios.sim.debug)
pnpm e2e:test              # detox test (ios.sim.debug)
```

Ajuste o device em `.detoxrc.js` (`devices.simulator.device.type`) para um
simulador instalado (`xcrun simctl list devices`) e o `avdName` para um AVD
existente. Os diretórios `ios/` e `android/` são gerados sob demanda e estão no
`.gitignore` (workflow managed / CNG).

## Deploy / Publicação (EAS + Play Console)

App publicado no Google Play em **teste fechado** (trilha `alpha`). Configuração
em `eas.json` (perfil `production` com `autoIncrement` + `appVersionSource: remote`).

### Lançar um novo release (Android)

```bash
# 1. Commitar tudo (o EAS Build usa o estado commitado do git)
git status            # arvore tem que estar limpa

# 2. Gerar o AAB na nuvem (autoIncrement sobe o versionCode sozinho)
eas build --platform android --profile production

# 3. Enviar para a trilha de teste fechado (alpha) automaticamente
eas submit --platform android --profile production
```

O `versionName` vem do `version` em `app.json`; o `versionCode` é gerido remoto
pelo EAS (`appVersionSource: remote`). Bump o `version` em `app.json` quando
quiser mudar o nome da versão exibido.

### Credencial do `eas submit`

`eas submit` autentica na Play Developer API com uma chave de **service account**
do Google Cloud. O caminho está em `eas.json` → `submit.production.android.serviceAccountKeyPath`:

```
./google-play-service-account.json   # raiz do projeto, IGNORADO pelo git
```

- O arquivo **nunca** é commitado (`.gitignore` cobre o nome exato).
- A service account precisa da permissão **"Liberar apps para as faixas de teste"**
  no Play Console (Usuários e permissões).
- Em outra máquina, baixe a chave do Google Cloud e coloque-a nesse caminho.

> O **primeiro** release de um app tem que ser enviado **manualmente** pelo Play
> Console (a Play Developer API não cria o primeiro release). A partir do segundo,
> `eas submit` cobre o envio.
