const generateURLbyQueryString = (url, params) => {
  let url = new URL(url)
  let params = params
  return Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
}

module.exports.generateURLbyQueryString = generateURLbyQueryString