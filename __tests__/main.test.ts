/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */

import requireResolveHook, { bypass } from '../src'
import { fixture, nodeModules } from './helper'

const test = require('ava')

test('spec hook once', function (t) {
  const { unhook, bypass } = requireResolveHook('react', (id, parent, isMain, options) => {
    return fixture('react.js')
  })

  t.is(require.resolve('react'), fixture('react.js'))
  t.is(require('react'), 'mock react')

  t.is(
    bypass(() => require.resolve('react')),
    nodeModules('react.js')
  )

  unhook()
  t.is(require.resolve('react'), nodeModules('react.js'))
})

test('spec hook multi', function (t) {
  const { unhook: unhookReact, bypass: bypassReact } = requireResolveHook('react', (id, parent, isMain, options) => {
    t.is('react', id)
    return fixture('react.js')
  })

  const { unhook: unhookVue, bypass: bypassVue } = requireResolveHook('vue', (id, parent, isMain, options) => {
    t.is('vue', id)
    return fixture('vue.js')
  })

  t.is(require.resolve('react'), fixture('react.js'))
  t.is(require.resolve('vue'), fixture('vue.js'))

  t.is(
    bypass(() => require.resolve('react')),
    nodeModules('react.js')
  )
  t.is(
    bypassReact(() => require.resolve('react')),
    nodeModules('react.js')
  )
  t.is(
    bypassVue(() => require.resolve('vue')),
    nodeModules('vue.js')
  )
  t.is(
    bypassVue(() => require.resolve('react')),
    fixture('react.js')
  )

  unhookReact()
  unhookVue()
})

test('modify origin exports', function (t) {
  const { unhook: unhookVue, bypass: bypassVue } = requireResolveHook('vue', (id, parent, isMain, options) => {
    if (parent.filename === fixture('vue.js')) {
      return bypass(() => require('module')._resolveFilename('vue', parent, isMain, options))
    }
    return fixture('vue.js')
  })

  t.is(require('vue'), 'mock real vue')
  unhookVue()
})
