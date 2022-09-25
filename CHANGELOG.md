# changelog

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
- ⚡️ Compatible with [envDir](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#envdir-changes) configuration. [@lxs24sxl](https://github.com/lxs24sxl)

## 1.2.2
`2022-07-14`
- ⚡️ Compatible with [root](https://cn.vitejs.dev/config/shared-options.html#root) configuration. [@lxs24sxl](https://github.com/lxs24sxl)

## 1.2.3
`2022-07-25`
- 🐞 attribute contains the @ and . symbols, the tag is read incorrectly [#14](https://github.com/lxs24sxl/vite-plugin-html-env/pull/14) [@lxs24sxl](https://github.com/lxs24sxl)
- 🐞 Available in REGEXP-SYNTAX CHARACTER prefix and suffix. [#14](https://github.com/lxs24sxl/vite-plugin-html-env/pull/14) [@lxs24sxl](https://github.com/lxs24sxl)
- 🐞 peer dependency warning. [#16](https://github.com/lxs24sxl/vite-plugin-html-env/pull/16) [@lxs24sxl](https://github.com/lxs24sxl)
- ⚡️ Add the attributes `enforce` [@lxs24sxl](https://github.com/lxs24sxl)

## 1.2.4
`2022-07-28`
- 🐞 fix The spaces in front of the symbols of the substitution rule are cleared [#17](https://github.com/lxs24sxl/vite-plugin-html-env/pull/17) [@lxs24sxl](https://github.com/lxs24sxl)

## 1.2.5
`2022-09-26`
- 🐞 Fix url paths being recognized as comments issue [#20])(https://github.com/lxs24sxl/vite-plugin-html-env/issues/20) [@lxs24sxl](https://github.com/ lxs24sxl)
- 🐞 Add production-like behavior [#23](https://github.com/lxs24sxl/vite-plugin-html-env/issues/23) [@lxs24sxl](https://github.com/lxs24sxl)
