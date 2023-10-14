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
    const action = new Action('creating file')
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ raw: true }))
    action.succeeded()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `green(${'DONE:'})    creating file`,
        stream: 'stdout',
      },
    ])
  })

  test('log action in failed state', ({ assert }) => {
    const action = new Action('creating file')
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ raw: true }))
    action.failed('File already exists')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `red(FAILED:)  creating file \n         red(File already exists)`,
        stream: 'stderr',
      },
    ])
  })

  test('log action in skipped state', ({ assert }) => {
    const action = new Action('creating file')
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ raw: true }))
    action.skipped()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `cyan(SKIPPED:) creating file`,
        stream: 'stdout',
      },
    ])
  })

  test('disable colors', ({ assert }) => {
    const action = new Action('creating file')
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ silent: true }))
    action.succeeded()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `DONE:    creating file`,
        stream: 'stdout',
      },
    ])
  })

  test('dim message', ({ assert }) => {
    const action = new Action('creating file', { dim: true })
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ raw: true }))
    action.succeeded()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `dim(green(DONE:))    dim(creating file)`,
        stream: 'stdout',
      },
    ])
  })

  test('add skip reason to the log', ({ assert }) => {
    const action = new Action('creating file')
    const renderer = new MemoryRenderer()

    action.useRenderer(renderer)
    action.useColors(useColors({ raw: true }))
    action.skipped('invalid message')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `cyan(SKIPPED:) creating file dim((invalid message))`,
        stream: 'stdout',
      },
    ])
  })
})
