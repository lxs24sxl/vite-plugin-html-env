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
      const [k, ...values] = kv.split('=')
      const key = k.replace(/\s+/g, '')
      const value = values.join('=').trim()

      if (key) {
        res[key] = value
      }
    })

    return res
  } catch (err) {
    console.error(err)
  }
}

const _getModeEnvPath = () => {
  const argvList = process.argv.slice(2)
  const modeIndex = argvList.findIndex(arg => arg === '-m' || arg === '--mode')
  const modeFuzzyIndex = argvList.findIndex(arg => arg.indexOf('-m') > -1 || arg.indexOf('--mode') > -1)

  if (
    modeIndex !== -1 &&
    modeIndex === modeFuzzyIndex &&
    !!argvList[modeIndex + 1] // both null vs empty
  ) return `.env.${argvList[modeIndex + 1]}`

  if (
    modeFuzzyIndex !== -1 &&
    !!argvList[modeFuzzyIndex]
  ) return `.env.${argvList[modeFuzzyIndex].split('=')[1]}`
}

const modeEnvPath = _getModeEnvPath()
const envConfig = Object.assign(
  {},
  _loadEnv('.env'),
  !!modeEnvPath && _loadEnv(modeEnvPath),
)

function vitePluginHtmlEnv (config) {
  return {
    name: 'rollup-plugin-html-env',

    transformIndexHtml (html, ctx) {
      let ctxEnvConfig = {}
      // Use the loadEnv method provided by vite, because the code checks that it is a dev environment
      if (ctx.server) {
        ctxEnvConfig = loadEnv(ctx.server.config.mode, process.cwd()) || {}
      } else {
        Object.assign(ctxEnvConfig, envConfig)
      }

      const map = {...ctxEnvConfig, ...config}

      return html.replace(/<%\s+(\w+)\s+\/>/g, (match, key) => {
        return `${map[key]}`
      })
    }
  }
}

module.exports = vitePluginHtmlEnv
