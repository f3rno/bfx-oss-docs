'use strict'

const loadConfig = require('./lib/config/load')
const validateConfig = require('./lib/config/validate')
const renderUnifiedJSDocConfig = require('./lib/jsdoc/render_unified_config')
const getMD = require('./lib/markdown_it')
const SECTION_TYPES = require('./lib/render/section_types')
const renderPage = require('./lib/render/page')
const renderLibraries = require('./lib/render/libraries')
const buildLibsGo = require('./lib/build/libs_go')
const buildLibsRuby = require('./lib/build/libs_ruby')
const buildLibsPython = require('./lib/build/libs_python')

/**
 * Bitfinex documentation (static site generator & content)
 *
 * @todo organize exports once structure finalized
 * @todo extract static site generator as own module
 * @todo describe
 *
 * @license Apache-2.0
 * @module bfx-oss-docs
 */

module.exports = {
  SECTION_TYPES,
  loadConfig,
  validateConfig,
  renderUnifiedJSDocConfig,
  renderPage,
  renderLibraries,
  buildLibsGo,
  buildLibsRuby,
  buildLibsPython,
  getMD
}
