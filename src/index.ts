/**
 * Module to hook into the Node.js require and require.resolve function
 * @author imcuttle
 */
// import * as resolveFrom from 'resolve-from'
import * as ModuleType from 'module'

const Module = require('module')

export type StrictMatch = string | ((id: string) => boolean) | RegExp
export type Match = StrictMatch | StrictMatch[]
export type OnResolve = (id: string, parent: null | ModuleType, isMain: boolean, options: any) => string | false
export type Options = {
  ignoreModuleNotFoundError?: boolean
}

const isMatch = (match: Match, id: string) => {
  if (Array.isArray(match)) {
    return match.some((mat) => isMatch(mat, id))
  }

  let shouldUseHook = false
  if (typeof match === 'function') {
    shouldUseHook = match(id)
  } else if (typeof match === 'string') {
    shouldUseHook = id === match
  } else if (match instanceof RegExp) {
    shouldUseHook = match.test(id)
  }
  return shouldUseHook
}

const requireResolveHook = (match: Match, onResolve: OnResolve, options: Options = {}) => {
  const argv = [match, onResolve, options]
  const hook = () => {
    const argvList = (Module.__require_resolve_hook__ = Module.__require_resolve_hook__ || [])
    argvList.push(argv)

    if (!Module.__require_resolve_hook_origin_resolveFilename__) {
      Module.__require_resolve_hook_origin_resolveFilename__ = Module._resolveFilename
      const _resolveFilename = Module._resolveFilename

      Module._resolveFilename = function (request, parent, isMain, options) {
        const argvList = (Module.__require_resolve_hook__ || []).slice()

        while (argvList.length) {
          const [match, onResolve, opts = {}] = argvList.shift()
          const { ignoreModuleNotFoundError = true } = opts

          if (match) {
            if (isMatch(match, request)) {
              try {
                let result = onResolve(request, parent, isMain, options)
                if (result && typeof result === 'string') {
                  return result
                }
              } catch (err) {
                if (ignoreModuleNotFoundError && err && 'MODULE_NOT_FOUND' === err.code) {
                  return
                }
                throw err
              }
            }
          }
        }

        return _resolveFilename.call(this, request, parent, isMain, options)
      }
    }
  }

  const unhook = () => {
    const argvList = Module.__require_resolve_hook__ || []
    const index = argvList.indexOf(argv)
    if (index >= 0) {
      argvList.splice(index, 1)
    }

    if (!argvList.length) {
      unhookGlobal()
    }
  }

  hook()

  return {
    bypass: (fn: () => any): ReturnType<typeof fn> => {
      unhook()
      const result = fn()
      hook()
      return result
    },
    unhook: () => unhook()
  }
}

export const bypass = (fn: () => any): ReturnType<typeof fn> => {
  const _resolveFilename = Module._resolveFilename
  Module._resolveFilename = Module.__require_resolve_hook_origin_resolveFilename__ || Module._resolveFilename
  const result = fn()
  Module._resolveFilename = _resolveFilename
  return result
}

const unhookGlobal = () => {
  Module._resolveFilename = Module.__require_resolve_hook_origin_resolveFilename__ || Module._resolveFilename
  delete Module.__require_resolve_hook_origin_resolveFilename__
  delete Module.__require_resolve_hook__
}

export const unhook = unhookGlobal

export default requireResolveHook
