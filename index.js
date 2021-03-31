const { loadEnv } = require('vite')
const path = require('path')
const fs = require('fs')

const _resolve = dir => path.resolve(__dirname, dir)

const _loadEnv = (envPath = '.env') => {
  const envFilePath = _resolve(`${process.cwd()}/${envPath}`)
  try {
    let res = {}

    if (!fs.existsSync(envFilePath)) return {}

    const data = fs.readFileSync(envFilePath, 'utf8')

    data.split('\n').forEach((kv) => {
      const [key, value] = kv.replace(/\s*/g, '').split('=');
      if (key && value) {
        res[key] = value
      }
    })

    return res
  } catch (err) {
    console.error(err)
  }
}

function vitePluginHtmlEnv (config) {
  return {
    name: 'rollup-plugin-html-env',

    transformIndexHtml (html, ctx) {
      let ctxEnvConfig = {}
      // Use the loadEnv method provided by vite, because the code checks that it is a dev environment
      if (ctx.server) {
        ctxEnvConfig = loadEnv(ctx.server.config.mode, process.cwd()) || {}
      } else {
        const argvList = process.argv.slice(2)
        const argvLen = argvList.length
        const envCofnig = _loadEnv('.env')
        // If you run the build command, the plugin will read the value of .env
        if (argvLen === 1) {
          ctxEnvConfig = {...ctxEnvConfig, ...envCofnig}
        } else {
          // Only process the --mode command
          const modeKeyIndex = argvList.findIndex(arg => arg === '--mode')
          const modeValueIndex = modeKeyIndex + 1

          if (modeKeyIndex > -1 && argvLen >= modeValueIndex) {
            const envPath = `.env${argvList[modeValueIndex]? `.${argvList[modeValueIndex]}`: ''}`

            ctxEnvConfig =  {...ctxEnvConfig, ...envCofnig, ..._loadEnv(envPath)}
          }
        }
      }

      const map = {...ctxEnvConfig, ...config}

      return html.replace(/<% (\w+) \/>/g, (match, key) => {
        return `${map[key]}`
      })
    }
  }
}

module.exports = vitePluginHtmlEnv
