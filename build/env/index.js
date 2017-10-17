const path = require('path')

module.exports = {
  ENTRY: path.resolve(__dirname, '../../src'),
  NODE_ENV: JSON.stringify('production'),
  OUTPUT: path.resolve(__dirname, '../../dist')
}