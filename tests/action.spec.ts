/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { useColors } from '../src/colors.js'
import { Action } from '../src/logger/action.js'
import { MemoryRenderer } from '../src/renderers/memory.js'

test.group('Action', () => {
  test('log action in succeeded state', ({ assert }) => {
    const action = new Action('create')
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ raw: true }))
    action.succeeded('hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `green(${'CREATE:'}) hello world`,
        stream: 'stdout',
      },
    ])
  })

  test('log action in failed state', ({ assert }) => {
    const action = new Action('create')
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ raw: true }))
    action.failed('hello world', 'File already exists')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `red(ERROR:)  hello world \n        red(File already exists)`,
        stream: 'stderr',
      },
    ])
  })

  test('log action in skipped state', ({ assert }) => {
    const action = new Action('create')
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ raw: true }))
    action.skipped('hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `cyan(SKIP:)   hello world`,
        stream: 'stdout',
      },
    ])
  })

  test('disable colors', ({ assert }) => {
    const action = new Action('create')
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ silent: true }))
    action.succeeded('hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `CREATE: hello world`,
        stream: 'stdout',
      },
    ])
  })

  test('dim message', ({ assert }) => {
    const action = new Action('create', { dim: true })
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ raw: true }))
    action.succeeded('hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `dim(green(CREATE:)) dim(hello world)`,
        stream: 'stdout',
      },
    ])
  })

  test('add skip reason to the log', ({ assert }) => {
    const action = new Action('create')
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ raw: true }))
    action.skipped('hello world', 'invalid message')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `cyan(SKIP:)   hello world dim((invalid message))`,
        stream: 'stdout',
      },
    ])
  })
})
