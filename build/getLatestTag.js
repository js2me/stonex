const fs = require('fs')
const path = require('path')

const changelog = fs.readFileSync(path.resolve(__dirname, '../CHANGELOG.md'))
const latestVersionRow = changelog
  .toString()
  .split(/(\r\n)|(\n)/g)
  .filter(
    str => str && str.startsWith('## ') && !str.startsWith('## [VERSION]')
  )[0]

if (!latestVersionRow) {
  throw Error('Nothing any versions in changelog')
}

module.exports = latestVersionRow.split(/\[|\]/g)[1].replace(/\./g, '')
