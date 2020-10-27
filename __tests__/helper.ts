/**
 * @file helper
 */

const nps = require('path')

function fixture(...args: string[]) {
  return nps.join.apply(nps, [__dirname, 'fixture'].concat(args))
}

function nodeModules(...args: string[]) {
  return nps.join.apply(nps, [__dirname, 'node_modules'].concat(args))
}

export { fixture, nodeModules }
