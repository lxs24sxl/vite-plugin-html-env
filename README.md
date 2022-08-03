# vite-plugin-html-env [![npm](https://img.shields.io/npm/v/vite-plugin-html-env.svg)](https://npmjs.com/package/vite-plugin-html-env)

A Vite Plugin for rewriting html

English | [简体中文](./README-zh_CN.md)

## Usage
```sh
npm install --save-dev vite-plugin-html-env
# or
yarn add vite-plugin-html-env -D
```

```js
// vite.config.js
import VitePluginHtmlEnv from 'vite-plugin-html-env'

export default {
  plugins: [
    VitePluginHtmlEnv(),
    // or
    // VitePluginHtmlEnv({
    //  CUSTOM_FIELD
    // })

    // Customizable prefixes and suffixes
    // VitePluginHtmlEnv({
    //   prefix: '<{',
    //   suffix: '}>',
    //   envPrefixes: ['VITE_', 'CUSTOME_PREFIX_']
    // })

    // Enable new compile mode by default
    // 1. add directives => vite-if, vite-else
    // 2. Compatible with `import.meta.env.VITE_APP__****`
    // If there are compatibility issues with the new version, please raise the `issue` or submit a `merge request`, I will deal with it promptly in my personal free time.
    VitePluginHtmlEnv({
      compiler: true
      // compiler: false // old
    })
  ]
}
```



It is recommended to use `VITE_APP_` as the key prefix.

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

By default, the local environment reads the `.env` file.Read the corresponding `.env.***` file, when you configure the `--mode` command.Vite configuration instructions for `.env` files [Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html#env-variables)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- Version 1.0.4 uses prefix = <{ and suffix = }> by default -->
    <!-- but is also compatible with older versions of prefixes and suffixes -->

    <!-- <script src="//<% VITE_APP_HOST />/***.js"></script> -->
    <!-- <title><% VITE_APP_TITLE /></title> -->

    <script src="//<{ VITE_APP_HOST }>/***.js"></script>
    <link rel="stylesheet" href="//<{ VITE_APP_HOST }>/test.css" />
    <title><{ VITE_APP_TITLE }></title>

    <!-- compiler: true -->
    <!-- Example 1 -->
    <!-- VITE_APP_ENV = dev -->
    <script vite-if="import.meta.env.VITE_APP_ENV === dev">
      console.log('vite-if')
    </script>
    <script vite-else>console.log('vite-else')</script>

    <!-- Example 2 -->
    <script vite-if="<{ VITE_APP_ENV }> !== dev">
      console.log('vite-if')
    </script>
    <script vite-else>
      console.log('vite-else')
    </script>

    <!-- Example 3 -->
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


## Options

### `prefix`

- **Type:** `string`
- **Default:** `'<{'`

### `suffix`

- **Type:** `string`
- **Default:** `'}>'`

### `envPrefixes`
Set the prefixes attribute of the `loadEnv` method in dev mode, vite uses `VITE_` as the prefix of environment variables by default.

- **Type:** `string | string[]`
- **Default:** `VITE_`

### `compiler`

- **Type:** `boolean`
- **Default:** `true`

The new version of the plugin is enabled by default, and the template compilation mode is added, which contains new directives `vite-if` and `vite-else`, new parsing rules `import.meta.env.VITE_APP_***`.

### `enforce`
- **Type:** `string`
- **Default:** `null`

The value of enforce can be either "pre" or "post". [plugin-ordering](https://vitejs.dev/guide/api-plugin.html#plugin-ordering])


### `compress`
- **Type:** `boolean`
- **Default:** `false`

Simple compression: remove spaces and line breaks
