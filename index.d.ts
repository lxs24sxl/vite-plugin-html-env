import { Plugin } from 'vite'

interface configType {
  /**
   * @default '<{'
   */
  prefix?: string
  /**
   * @default '}>'
   */
  suffix?: string
  /**
   * Set the prefixes attribute of the `loadEnv` method in dev mode,
   * vite uses `VITE_` as the prefix of environment variables by default.
   * @default VITE_
   */
  envPrefixes?: string | string[]
  /**
   * The new version of the plugin is enabled by default,
   * and the template compilation mode is added,
   * which contains new directives `vite-if` and `vite-else`,
   * new parsing rules `import.meta.env.VITE_APP_***`.
   * @default null
   */
  compiler?: boolean
  /**
   * The value of enforce can be either "pre" or "post".
   * [plugin-ordering](https://vitejs.dev/guide/api-plugin.html#plugin-ordering])
   */
  enforce?: 'pre' | 'post'
  /**
   * Simple compression: remove spaces and line breaks
   * @default false
   */
  compress?: boolean
}

type PluginFactory = (config?: configType) => Plugin

declare const vitePluginHtmlEnv: PluginFactory & { preambleCode: string }

export default vitePluginHtmlEnv
