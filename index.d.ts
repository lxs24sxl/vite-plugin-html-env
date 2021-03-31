import { Plugin } from 'vite'

interface configType {
  [key: string]: number | string | boolean
}

type PluginFactory = (config?: configType) => Plugin

declare const vitePluginHtmlEnv: PluginFactory & { preambleCode: string }

export default vitePluginHtmlEnv
