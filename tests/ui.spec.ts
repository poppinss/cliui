/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { cliui, Instructions, Logger, Table, TaskManager } from '../index.js'

test.group('UI', () => {
  test('instantiate ui primitives', ({ assert }) => {
    const ui = cliui()
    assert.instanceOf(ui.logger, Logger)
    assert.instanceOf(ui.instructions(), Instructions)
    assert.instanceOf(ui.sticker(), Instructions)
    assert.instanceOf(ui.table(), Table)
    assert.instanceOf(ui.tasks(), TaskManager)
  })

  test('disable colors', ({ assert }) => {
    const ui = cliui({ mode: 'silent' })
    assert.equal(ui.colors.green('hello world'), 'hello world')
  })

  test('use raw colors', ({ assert }) => {
    const ui = cliui({ mode: 'raw' })
    assert.equal(ui.colors.green('hello world'), 'green(hello world)')
  })

  test('use memory renderer when using raw mode', ({ assert }) => {
    const ui = cliui({ mode: 'raw' })
    ui.logger.log(ui.colors.green('hello world'))

    assert.deepEqual(ui.logger.getLogs(), [
      {
        stream: 'stdout',
        message: 'green(hello world)',
      },
    ])
  })

  test('switch to raw mode', ({ assert }) => {
    const ui = cliui()
    ui.switchMode('raw')
    ui.logger.log(ui.colors.green('hello world'))

    assert.deepEqual(ui.logger.getLogs(), [
      {
        stream: 'stdout',
        message: 'green(hello world)',
      },
    ])
  })

  test('switch to silent mode', ({ assert }) => {
    const ui = cliui({ mode: 'raw' })
    ui.switchMode('silent')

    assert.equal(ui.colors.green('hello world'), 'hello world')
    ui.logger.log(ui.colors.green('hello world'))
    assert.deepEqual(ui.logger.getLogs(), [])
  })

  test('switch to normal mode', ({ assert }) => {
    const ui = cliui({ mode: 'raw' })
    ui.switchMode('normal')

    assert.equal(ui.colors.green('hello world'), '\u001b[32mhello world\u001b[39m')
    ui.logger.log(ui.colors.green('hello world'))
    assert.deepEqual(ui.logger.getLogs(), [])
  })
})
