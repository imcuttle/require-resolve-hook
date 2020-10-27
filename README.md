# require-resolve-hook

[![Build status](https://img.shields.io/travis/imcuttle/require-resolve-hook/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/require-resolve-hook)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/require-resolve-hook.svg?style=flat-square)](https://codecov.io/github/imcuttle/require-resolve-hook?branch=master)
[![NPM version](https://img.shields.io/npm/v/require-resolve-hook.svg?style=flat-square)](https://www.npmjs.com/package/require-resolve-hook)
[![NPM Downloads](https://img.shields.io/npm/dm/require-resolve-hook.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/require-resolve-hook)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> Module to hook into the Node.js require and require.resolve function

## Installation

```bash
npm install require-resolve-hook
# or use yarn
yarn add require-resolve-hook
```

## Usage

```javascript
import requireResolveHook, { bypass, unhook } from 'require-resolve-hook'

const { unhook: unhookReact, bypass: bypassReact } = requireResolveHook('react', (id, parent, isMain) => {
  return '/path/to/your/custom-react' // absolute path
})

require.resolve('react') // => '/path/to/your/custom-react'
require('react') // => export '/path/to/your/custom-react'

bypassReact(() => require.resolve('react')) // => '/path/to/real-react'

unhookReact()
require.resolve('react') // => '/path/to/real-react'
```

## API

#### `requireResolveHook(match: Match, onResolve: OnResolve)`

- **Returns:** `{ bypass: (fn) => ReturnType<fn>, unhook: () => void }`

  `bypass` means:

  ```javascript
  bypass = (fn) => {
    unhook()
    const res = fn()
    hook()
    return res
  }
  ```

#### `StrictMatch`

- **Type:** `string | RegExp | (id: string) => boolean`

#### `Match`

- Type: `StrictMatch | StrictMatch[]`

#### `OnResolve`

- **Type:** `(id: string, parent: null | Module, isMain: boolean) => string | false`

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by imcuttle, <a href="mailto:imcuttle@163.com">imcuttle@163.com</a>.

## License

MIT - [imcuttle](https://github.com/imcuttle) 🐟
