# 更新日志

## 1.0.3

`2021-10-12`
- 🐞 修复值中的空格将被替换为空问题。[#1](https://github.com/lxs24sxl/vite-plugin-html-env/pull/1) [@0x0a0d](https://github.com/0x0a0d)
- 🐞 修复argv错误。[#2](https://github.com/lxs24sxl/vite-plugin-html-env/pull/2) [@0x0a0d](https://github.com/0x0a0d)
- 🐞 修复 --mode xx 和 --mode=xx 的兼容性问题。[@lxs24sxl](https://github.com/lxs24sxl)

## 1.1.1

`2022-02-24`
- ⚡️ 增加属性`prefix`和`suffix`。[@lxs24sxl](https://github.com/lxs24sxl)

## 1.1.2
`2022-04-20`
- ⚡️ 添加属性`envPrefixes`来定制loadEnv读取的环境变量前缀。[@lxs24sxl](https://github.com/lxs24sxl)

## 1.1.3
`2022-06-20`
- 🐞 修复传递少数选项其余选项，默认选项读取错误问题 [@ottaviano](https://github.com/ottaviano)

## 1.2.0
`2022-07-03`
- ⚡️ 添加属性`compiler` [@lxs24sxl](https://github.com/lxs24sxl)
  - 新版本的插件默认启用，增加了模板编译模式，包含新指令`vite-if`和`vite-else`，新解析规则`import.meta.env.VITE_APP_***`。

## 1.2.1
`2022-07-13`
- ⚡️兼容[envDir](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#envdir-changes)配置。[@lxs24sxl](https://github.com/lxs24sxl)

## 1.2.2
`2022-07-14`
- ⚡️兼容[root](https://cn.vitejs.dev/config/shared-options.html#root)配置。[@lxs24sxl](https://github.com/lxs24sxl)

## 1.2.3
`2022-07-25`
- 🐞 修复 属性包含@和.符号时，标签被错误地读取 问题 [#14](https://github.com/lxs24sxl/vite-plugin-html-env/pull/14) [@lxs24sxl](https://github.com/lxs24sxl)
- 🐞 前缀和后缀中可以使用正则表达式的符号。[#14](https://github.com/lxs24sxl/vite-plugin-html-env/pull/14) [@lxs24sxl](https://github.com/lxs24sxl)
- 🐞 peer依赖警告问题。[#16](https://github.com/lxs24sxl/vite-plugin-html-env/pull/16) [@lxs24sxl](https://github.com/lxs24sxl)
- ⚡️ 添加属性`enforce` [@lxs24sxl](https://github.com/lxs24sxl)

## 1.2.4
`2022-07-28`
- 🐞 修复 替换规则的符号前面的空格被清除 问题 [#17](https://github.com/lxs24sxl/vite-plugin-html-env/pull/17) [@lxs24sxl](https://github.com/lxs24sxl)

## 1.2.5
`2022-09-26`
- 🐞 修复 url路径被识别成注释 问题 [#20])(https://github.com/lxs24sxl/vite-plugin-html-env/issues/20) [@lxs24sxl](https://github.com/lxs24sxl)
- 🐞 添加 预生产行为 [#23](https://github.com/lxs24sxl/vite-plugin-html-env/issues/23) [@lxs24sxl](https://github.com/lxs24sxl)

## 1.2.6
`202-09-26`
- ⚡️ 更新声明文件 [#24](https://github.com/lxs24sxl/vite-plugin-html-env/pull/24) [leekoho](https://github.com/leekoho)
