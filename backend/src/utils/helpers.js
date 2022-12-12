const deleteSlash = (url, pos = 'first') => {
  return pos === 'last' ? url.replace(/\/$/, '') : url.replace('/', '');
}

module.exports = { deleteSlash }