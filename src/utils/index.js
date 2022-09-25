function removeComments (codes) {
  let { replacedCodes, matchedObj } = replaceQuotationMarksWithForwardSlash(codes)

  replacedCodes = replacedCodes.replace(/(\s*(?<!(\\|https:|http:))\/\/.*$)|(\s*(?<!\\)\/\*[\s\S]*?(?<!\\)\*\/)/mg, '')
  Object.keys(matchedObj).forEach(k => {
    replacedCodes = replacedCodes.replace(k, matchedObj[k])
  })

  return replacedCodes

  function replaceQuotationMarksWithForwardSlash (codes) {
    let matchedObj = {}
    let replacedCodes = ''

    let regQuotation = /(?<!\\)('|"|`).*?(?<!\\)\1/mg
    let uniqueStr = 'QUOTATIONMARKS' + Math.floor(Math.random() * 10000)

    let index = 0
    replacedCodes = codes.replace(regQuotation, function (match) {
      let s = uniqueStr + (index++)
      matchedObj[s] = match
      return s
    })

    return { replacedCodes, matchedObj }
  }
}

module.exports.removeComments = removeComments
