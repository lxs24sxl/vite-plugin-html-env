const { removeComments } = require("../utils")
const DOCTYPE_REG = /^<!DOCTYPE [^>]+>/i
const LETTER_REG = /[a-zA-Z\-@\.]/
const EMPTY_REG = /[\s\n]/
const NUMBER_REG = /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/

const ATTRIBUTE_VALUE_REG = /(\s*[===|==|<=|>=|<|>]+\s*)/

const INIT = /*                           */ 0b00000000000
const TAG_START = /*                      */ 0b00000000001
const ATTRIBUTE_START = /*                */ 0b00000000010
const ATTRIBUTE_VALUE = /*                */ 0b00000000100
const ATTRIBUTE_END = /*                  */ 0b00000001000
const TAG_END = /*                        */ 0b00000010000
const OPEN_TAG = /*                       */ 0b00000100000
const CLOSE_TAG_START = /*                */ 0b00001000000
const CLOSE_TAG_END = /*                  */ 0b00010000000

const NONE = 0
const REMOVE = 1

const CLOSE_TAG = ['meta', 'base', 'br', 'hr', 'img', 'input', 'col', 'frame', 'link', 'area', 'param', 'embed', 'keygen', 'source']
const CLOSE_TAG_MAP = CLOSE_TAG.reduce((result, key) => {
  result[key] = true
  return result
}, {})

const DIRECTIVE_LIST = ['vite-if', 'vite-else']
const DIRECTIVE_LIST_MAP = DIRECTIVE_LIST.reduce((result, key) => {
  result[key] = true
  return result
}, {})

function getFormatValue (v) { return NUMBER_REG.test(v) ? v : `'${v}'` }

function createNode ({ tag, type = 'element', text = '' }) {
  return {
    tag,
    attribute: {},
    text,
    children: [],
    effect: NONE,
    type
  }
}

module.exports = class ParseHTML {
  constructor (html, options) {
    // string
    this.html = html
    // html-env options
    this.options = options || {}

    // main
    this.index = 0
    this.stack = []
    this.status = INIT

    // attribute
    this.tagName = ''
    this.text = ''
    this.attributeKey = ''
    this.attributeValue = ''
    this.doctype = ''

    // node
    this.node = null
    this.current = null
    this.parent = null

    // Marking Stack
    this.effectStack = []
  }

  preHandle () {
    // Clear multi-line comments and single-line comments
    this.html = removeComments(this.html)

    if (this.options.replaceLinefeed) {
      this.html = this.html.replace(/\n[ ]+/g, ' ')
      this.html = this.html.replace(/\n/g, '')
    }

    this.html = this.html.replace(/[ ]+/g, ' ')

    this.html = this.html.replace(/[\s]*=[\s]*"/g, '="')
    // Clear the html comments
    this.html = this.html.replace(/<!\-\-(\s|\S)*\-\->/g, '')

    let { prefix, suffix } = this.options

    const reg = new RegExp(`(${prefix}|<%)\\s*([\\w\\-]+)\\s*(${suffix}|\/>)`, 'g')

    this.html = this.html.replace(reg, (...arg) => `${this.options[arg[2]] || ''}`)
    this.html = this.html.replace(/import\.meta\.env\.([a-zA-Z_\-]+)/g, (...arg) => `${this.options[arg[1]] || ''}`)

    this.html = this.html.replace(/<[\s]+/g, '<')
    this.html = this.html.replace(/[\s]+</g, '<')
    this.html = this.html.replace(/[\s]+>/g, '>')
    this.html = this.html.replace(/[\s]+\/>/g, '/>')
  }

  advance (n) {
    this.index += n
    this.html = this.html.substring(n)
  }

  parse () {
    this.preHandle()
    let textEnd = this.html.indexOf('<')

    if (textEnd === 0) {
      // Doctype:
      const doctypeMatch = this.html.match(DOCTYPE_REG)
      if (doctypeMatch) {
        this.doctype = doctypeMatch[0]
        this.index = this.doctype.length
      }
    }

    while (this.index < this.html.length) {
      const current = this.html[this.index]
      const pre = this.html[this.index - 1]
      const next = this.html[this.index + 1]

      switch (this.status) {
        case INIT:
          if (current === '<') this.status = TAG_START
          break
        case TAG_START:
          this.onTagStartEvent(current, next)
          break
        case ATTRIBUTE_START:
          this.onAttributeStartEvent(current, next)
          break
        case ATTRIBUTE_VALUE:
          this.onAttributeValueEvent(current, next)
          break
        case ATTRIBUTE_END:
          this.onAttributeEndEvent(current, next)
          break
        case TAG_END:
          this.onTagEndEvent(current, pre)
          break
        case OPEN_TAG:
          this.onOpenTagEvent(current, next)
          break
        case CLOSE_TAG_START:
          this.onCloseTagStartEvent(current, next)
          break
        case CLOSE_TAG_END:
          this.onCloseTagEndEvent(current)
          break
        default:
          break
      }
      this.index++
    }

    return this.node
  }

  onTagStartEvent (current, next) {
    if (LETTER_REG.test(current)) {
      this.tagName += current
    } else if (EMPTY_REG.test(current) && LETTER_REG.test(next)) {
      this.generateElementEvent()
      this.status = ATTRIBUTE_START
    }

    if (next === '>') {
      this.generateElementEvent()
      this.status = TAG_END
    }
  }
  onAttributeStartEvent (current, next) {
    if (current !== '=') this.attributeKey += current

    if ([' ', '>'].includes(next) || (next === '/' && this.html[this.index + 2] === '>')) {
      this.current.attribute[this.attributeKey] = this.attributeValue
      this.optimize()
      this.attributeKey = ''
      this.attributeValue = ''
    }

    if (next === ' ') {
      this.status = ATTRIBUTE_END
    } else if (['>', ''].includes(next) || (next === '/' && this.html[this.index + 2] === '>')) {
      this.status = TAG_END
    } else if (next === '"') {
      this.status = ATTRIBUTE_VALUE
    }
  }

  onAttributeValueEvent (current, next) {
    if (current !== '"') this.attributeValue += current

    if (next !== '"') return

    this.current.attribute[this.attributeKey] = this.attributeValue
    this.optimize()
    this.attributeKey = ''
    this.attributeValue = ''
    this.status = ATTRIBUTE_END
  }

  onAttributeEndEvent (current, next) {
    if (EMPTY_REG.test(current)) this.status = ATTRIBUTE_START

    if (next === '>') this.status = TAG_END
  }

  onTagEndEvent (current, pre) {
    if (pre === '/' && current === '>') {
      this.status = CLOSE_TAG_END
      this.index--
      return
    }

    if (current === '>') {
      this.status = OPEN_TAG
      if (CLOSE_TAG_MAP[this.tagName]) {
        this.status = CLOSE_TAG_END
        this.index--
        return
      }
      this.tagName = ''
    }
  }

  onOpenTagEvent (current, next) {

    if (current === '<') {
      if (this.current.tag === 'script' && next !== '/') {
        this.text += current
        return
      }

      if (next === '/') {
        this.generateTextNodeEvent()
        this.status = CLOSE_TAG_START
        return
      }

      this.generateTextNodeEvent()
      this.status = TAG_START
      return
    }

    this.text += current
  }

  onCloseTagStartEvent (current, next) {
    if (LETTER_REG.test(current)) {
      this.tagName += current
    } else if (EMPTY_REG.test(current)) {
      throw new Error(`Failed to parse the closure tag: ${this.tagName}`);
    }

    if (next === '>') {
      this.status = CLOSE_TAG_END
    }
  }

  onCloseTagEndEvent (current) {
    if (current === '>') {
      const top = this.stack[this.stack.length - 1]

      if (top.tag === this.tagName) {
        this.stack.pop()

        this.current = this.stack[this.stack.length - 1]
        this.status = OPEN_TAG

        this.tagName = ''
      } else {
        throw new Error(`Cannot be closed: ${this.tagName || top.tag}`);
      }
    }
  }

  generateElementEvent () {
    const node = createNode({ tag: this.tagName })
    if (this.node) {
      this.parent = this.current
      this.current = node


      this.parent.children.push(this.current)
      this.generateTextNodeEvent()

      this.stack.push(this.current)
      return
    }

    this.node = node
    this.current = this.node
    this.parent = null

    this.stack.push(this.current)
  }

  generateTextNodeEvent () {
    if (!this.text) return
    this.current.children.push(createNode({ tag: '', text: this.text.trim(), type: 'textNode' }))
    this.text = ''
  }

  optimize () {
    if (this.attributeKey.indexOf('vite-') === -1) return

    let curEffect = null
    switch (this.attributeKey) {
      case 'vite-if':
        const { effect, value } = this.getCalculationInfo(this.attributeValue)
        this.effectStack = []
        this.current.effect = effect
        this.effectStack.push({
          type: this.attributeKey,
          value,
          effect
        })
        break
      case 'vite-else':
        curEffect = this.effectStack.pop()
        this.current.effect = curEffect.value ? REMOVE : NONE
        break
      default:
        break
    }
  }

  getCalculationInfo (text) {
    let [left = '', symbol = '', right = ''] = text.split(ATTRIBUTE_VALUE_REG)
    let effect = NONE, value = false

    if (symbol) {
      symbol = symbol.trim()
      value = new Function(`return ${getFormatValue(left)} ${symbol} ${getFormatValue(right)}`)()
    } else if (left) {
      value = !!(left.trim())
    }

    effect = value ? NONE : REMOVE

    return {
      left,
      symbol,
      right,
      effect,
      value
    }
  }

  generate () {
    let html = ''

    if (this.doctype) {
      html += this.doctype + '\n'
    }

    this.dfs(this.node, {
      start: (parent, tree, depth) => {
        const { tag, attribute, text, children, type } = tree

        const attributeText = Object.keys(attribute).reduce((text, key) => {
          if (DIRECTIVE_LIST_MAP[key]) return text

          if (attribute[key]) {
            text += ` ${key}="${attribute[key]}"`
          } else {
            text += ` ${key}`
          }
          return text
        }, '')

        if (type === 'textNode') {
          if (!this.checkOnlyOneTextNode(parent)) {
            html += Array.from({ length: depth - 1 }).fill('\t').join('')
          }
          html += text
          return
        }

        html += Array.from({ length: depth - 1 }).fill('\t').join('')

        if (CLOSE_TAG_MAP[tag]) {
          html += `<${tag}${attributeText}/>\n`
          return
        }

        html += `<${tag}${attributeText}>`
        if (text) {
          html += `${text}`
        }

        if (this.checkOnlyOneTextNode(tree)) return

        if (children.length) {
          html += '\n'
        }
      },
      end: (parent, tree, depth) => {
        const { tag, text, children, type } = tree
        if (CLOSE_TAG_MAP[tag]) return

        const length = text || children.length === 0 ? 0 : depth - 1

        if (!this.checkOnlyOneTextNode(tree)) {
          html += Array.from({ length }).fill('\t').join('')
        }

        if (type === 'textNode') {
          if (this.checkOnlyOneTextNode(parent)) return
          html += '\n'
          return
        }

        html += `</${tag}>\n`
      }
    })

    // Simple compression:
    // remove spaces and line breaks
    if (this.options.compress) {
      html = html.replace(/\n[ ]+/g, ' ')
      html = html.replace(/\n/g, '')
      html = html.replace(/[ ]+/g, ' ')
      html = html.replace(/[\s]*=[\s]*"/g, '="')
      html = html.replace(/<[\s]+/g, '<')
      html = html.replace(/[\s]+</g, '<')
      html = html.replace(/[\s]+>/g, '>')
      html = html.replace(/[\s]+\/>/g, '/>')
    }

    return html
  }

  dfs (tree, { start, end }) {
    const walk = (parent, child, depth = 1) => {
      if (this.checkValidate(child)) return

      start(parent, child, depth)
      if (child.children && child.children.length) {
        child.children.forEach(node => {
          walk(child, node, depth + 1)
        })
      }
      end(parent, child, depth)
    }

    walk(null, tree)
  }

  checkValidate (node) {
    return ((node.type === 'textNode' && !node.text) && (node.type === 'element' && !node.tag)) || node.effect !== NONE
  }

  checkOnlyOneTextNode (node) {
    return node && node.children && node.children.length === 1 && node.children[0].type === 'textNode'
  }
}
