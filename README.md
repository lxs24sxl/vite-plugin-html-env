# vite-plugin-html-env [![npm](https://img.shields.io/npm/v/vite-plugin-html-env.svg)](https://npmjs.com/package/vite-plugin-html-env)

A Vite Plugin for rewriting html

## Usage
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
  ]
}
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script src="//<% VITE_APP_HOST />/***.js"></script>
    <title><% VITE_APP_TITLE /></title>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Config

- `{[key: string]: string | boolean | number}`
