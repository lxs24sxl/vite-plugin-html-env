---
order: 6
title: Change Log
toc: false
timeline: true
---

## 1.0.3

`2021-10-12`
- 🐞 Fix space in value will be replace to empty。[#1](https://github.com/lxs24sxl/vite-plugin-html-env/pull/1) [@0x0a0d](https://github.com/0x0a0d)
- 🐞 Fix argv bug。[#2](https://github.com/lxs24sxl/vite-plugin-html-env/pull/2) [@0x0a0d](https://github.com/0x0a0d)
- 🐞 Fix --mode xx and --mode=xx compatibility issues。[@lxs24sxl](https://github.com/lxs24sxl)

## 1.1.1

`2022-02-24`
- ⚡️ Add the attributes `prefix` and `suffix` to the incoming parameters。[@lxs24sxl](https://github.com/lxs24sxl)

## 1.1.2
`2022-04-20`
- ⚡️ Add the attributes `envPrefixes` to customize the environment variable prefix read by loadEnv. [@lxs24sxl](https://github.com/lxs24sxl)

## 1.1.3
`2022-06-20`
- 🐞 Allow passing only few options [@ottaviano](https://github.com/ottaviano)

## 1.2.0
`2022-07-03`
- ⚡️ Add the attributes `compiler` [@lxs24sxl](https://github.com/lxs24sxl)
  - The new version of the plugin is enabled by default, and the template compilation mode is added, which contains new directives `vite-if` and `vite-else`, new parsing rules `import.meta.env.VITE_APP_***`.

## 1.2.1
`2022-07-13`
- Compatible with [envDir](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#envdir-changes) configuration. [@lxs24sxl](https://github.com/lxs24sxl)
