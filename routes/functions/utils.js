const { getLatestUpdateReferenceId } = require('../../Helper/UserHelper')
const { separator } = require('faker/lib/locales/en')

const generateURLbyQueryString = (base_url, parameters) => {
  let url = new URL(base_url)
  let params = parameters
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  return url
}

const getToday = (separator = '-') => {
  const _date = new Date()
  return [_date.getFullYear(), ('0' + (_date.getMonth() + 1)).slice(-2), ('0' + _date.getDate()).slice(-2)].join(separator)
}
module.exports.generateURLbyQueryString = generateURLbyQueryString
module.exports.getToday = getToday