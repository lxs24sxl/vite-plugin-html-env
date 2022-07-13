const { loadEnv } = require('vite')
const path = require('path')
const fs = require('fs')
const ParseHTML = require('./parse')

const _omit = (obj = {}, uselessKeys = []) => {
  return Object.keys(obj || {}).reduce((cur, key) => {
    return uselessKeys.includes(key) ? cur : { ...cur, [key]: obj[key] }
  }, {})
}

const _pick = (obj, defaultConfig = {}) => {
  return Object.keys(obj).length ? Object.keys(defaultConfig).reduce((cur, key) => {
    return {
      ...cur,
      [key]: typeof obj[key] === 'boolean' ? obj[key] : obj[key] || defaultConfig[key]
    }
  }, defaultConfig) : defaultConfig
}

const _resolve = (...arg) => path.resolve(__dirname, ...arg)

const _loadEnv = (envPath = '.env') => {
  const envFilePath = _resolve(process.cwd(), envPath)

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

const getEnvConfig = (envDir = '') => {
  const prefix = envDir ? `${envDir}/` : ''
  return Object.assign(
    {},
    _loadEnv(`${prefix}.env`),
    !!modeEnvPath && _loadEnv(`${prefix}${modeEnvPath}`),
  )
}

const DEFAULT_CONFIG = {
  prefix: '<{',
  suffix: '}>',
  envPrefixes: 'VITE_',
  compiler: true
}

function vitePluginHtmlEnv (config) {
  let cacheEnvDir = ''

  return {
    name: 'rollup-plugin-html-env',

    config (cfg) {
      if (cfg && cfg.envDir) {
        cacheEnvDir = cfg && cfg.envDir
      }
    },

    transformIndexHtml (html, ctx) {
      config = config || {}
      const { prefix, suffix, envPrefixes, compiler } = _pick(config, DEFAULT_CONFIG)
      let ctxEnvConfig = {}
      // Use the loadEnv method provided by vite, because the code checks that it is a dev environment
      if (ctx.server) {
        const envDirPath = _resolve(process.cwd(), cacheEnvDir)
        ctxEnvConfig = loadEnv(ctx.server.config.mode, envDirPath, envPrefixes || 'VITE_') || {}
      } else {
        Object.assign(ctxEnvConfig, getEnvConfig(cacheEnvDir))
      }

      const map = { ...ctxEnvConfig, ..._omit(config, Object.keys(DEFAULT_CONFIG)) }

      if (compiler) {
        const parseHtml = new ParseHTML(html, {
          ...map,
          prefix,
          suffix
        })

        parseHtml.parse()

        return parseHtml.generate()
      }

      const reg = new RegExp(`(${prefix}|<%)\\s+(\\w+)\\s+(${suffix}|\/>)`, 'g')
      return html.replace(reg, (...arg) => {
        const key = arg[2]
        return `${map[key]}`
      })
    }
  }
}

module.exports = vitePluginHtmlEnv
