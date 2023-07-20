# vite-plugin-html-env [![npm](https://img.shields.io/npm/v/vite-plugin-html-env.svg)](https://npmjs.com/package/vite-plugin-html-env)

为html文件注入环境变量的插件

`vite@4.2.0`已经支持在`html`文件使用`env`变量, 建议使用官方的方案，感谢各位使用和支持`vite-plugin-html-env`。

[English](./README.md) | 简体中文

## 使用说明
```sh
npm install --save-dev vite-plugin-html-env
# or
yarn add vite-plugin-html-env -D
#or
pnpm add vite-plugin-html-env -D
```

```js
// vite.config.js
import VitePluginHtmlEnv from 'vite-plugin-html-env'

export default {
  plugins: [
    // VitePluginHtmlEnv(),

    // or
    // VitePluginHtmlEnv({
    //  CUSTOM_FIELD
    // })

    // 自定义前缀和后缀
    // VitePluginHtmlEnv({
    //   prefix: '<{',
    //   suffix: '}>',
    //   envPrefixes: ['VITE_', 'CUSTOME_PREFIX_']
    // })

    // 默认开启新编译模式
    // 1. 添加指令vite-if、vite-else
    // 2. 兼容 import.meta.env.VITE_APP_****
    // 如果新版本有兼容性问题，请在issue中提出问题或提交merge request，我将在个人空闲时间及时处理。
    VitePluginHtmlEnv({
      compiler: true
      // compiler: false // 旧版本
    })
  ]
}
```

建议使用`VITE_APP_`作为默认的环境变量前缀。

```
# .env
VITE_APP_TITLE=测试标题
VITE_APP_HOST=dev.sever****.com

# .env.build-prod
VITE_APP_TITLE=生产标题
VITE_APP_HOST=prod.sever.****.com
```

```json
{
  "scripts": {
    "start": "vite",
    "build": "tsc && vite build",
    "build:prod": "tsc && vite build --mode build-prod",
  }
}
```

默认情况下，本地环境读取`.env`文件。当你配置`--mode`命令时，读取相应的`.env.***`文件。`.env`文件的Vite配置说明 [Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html#env-variables)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- 1.0.4版本默认使用 前缀<{ 和 后缀 }> -->。
    <!-- 但也兼容旧版本的前缀和后缀 -->。

    <!-- <script src="//<% VITE_APP_HOST />/***.js"></script> -->
    <!-- <title><% VITE_APP_TITLE /></title> -->

    <script src="//<{ VITE_APP_HOST }>/***.js"></script>
    <link rel="stylesheet" href="//<{ VITE_APP_HOST }>/test.css" />
    <title><{ VITE_APP_TITLE }></title>

    <!-- 开启编译模式 -->
    <!-- 例子1 -->
    <!-- VITE_APP_ENV = dev -->
    <script vite-if="import.meta.env.VITE_APP_ENV === dev">
      console.log('vite-if')
    </script>
    <script vite-else>console.log('vite-else')</script>

    <!-- 例子2 -->
    <script vite-if="<{ VITE_APP_ENV }> !== dev">
      console.log('vite-if')
    </script>
    <script vite-else>
      console.log('vite-else')
    </script>

    <!-- 例子3 -->
    <!-- VITE_APP_NUM_9 = 9 -->
    <script vite-if="import.meta.env.VITE_APP_NUM_9 < 10">
      console.log('9 < 10')
    </script>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```


## 参数

### `prefix`

- **Type:** `string`
- **Default:** `'<{'`

### `suffx`

- **Type:** `string`
- **Default:** `'}>'`

### `envPrefixes`
在dev模式下设置`loadEnv`方法的前缀属性，vite默认使用`VITE_`作为环境变量的前缀。

- **Type:** `string | string[]`
- **Default:** `VITE_`

### `compiler`

- **Type:** `boolean`
- **Default:** `true`

默认开启新的插件版本，添加了模版编译模式，里面包含 新增指令 `vite-if` 和 `vite-else`、新增解析规则 `import.meta.env.VITE_APP_***`。

### `enforce`
- **Type:** `string`
- **Default:** `null`

enforce 的值可以是pre 或 post。[plugin-ordering](https://vitejs.dev/guide/api-plugin.html#plugin-ordering)

### `compress`
- **Type:** `boolean`
- **Default:** `false`

简单的压缩功能: 移除空格和换行符
