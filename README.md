# vite-plugin-html-env [![npm](https://img.shields.io/npm/v/vite-plugin-html-env.svg)](https://npmjs.com/package/vite-plugin-html-env)

A Vite Plugin for rewriting html

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
    // })
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

### `suffx`

- **Type:** `string`
- **Default:** `'}>'`
