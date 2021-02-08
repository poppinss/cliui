/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { Table } from '../src/Table'
import { MemoryRenderer } from '../src/Renderer/Memory'

test.group('Table', () => {
  test('render table', (assert) => {
    const table = new Table({}, true)
    const renderer = new MemoryRenderer()

    table.useRenderer(renderer)
    table.head(['name', 'profession'])
    table.row(['virk', 'engineer'])

    table.render()
    assert.deepEqual(renderer.logs, [
      {
        message: 'cyan(name)|cyan(profession)',
        stream: 'stdout',
      },
      {
        message: 'virk|engineer',
        stream: 'stdout',
      },
    ])
  })

  test('render table with mutliple rows', (assert) => {
    const table = new Table({}, true)
    const renderer = new MemoryRenderer()

    table.useRenderer(renderer)
    table.head(['name', 'profession'])
    table.row(['virk', 'engineer'])
    table.row(['romain', 'engineer'])

    table.render()
    assert.deepEqual(renderer.logs, [
      {
        message: 'cyan(name)|cyan(profession)',
        stream: 'stdout',
      },
      {
        message: 'virk|engineer',
        stream: 'stdout',
      },
      {
        message: 'romain|engineer',
        stream: 'stdout',
      },
    ])
  })

  test('disable colors', (assert) => {
    const table = new Table({ colors: false }, true)
    const renderer = new MemoryRenderer()

    table.useRenderer(renderer)
    table.head(['name', 'profession'])
    table.row(['virk', 'engineer'])
    table.row(['romain', 'engineer'])

    table.render()
    assert.deepEqual(renderer.logs, [
      {
        message: 'name|profession',
        stream: 'stdout',
      },
      {
        message: 'virk|engineer',
        stream: 'stdout',
      },
      {
        message: 'romain|engineer',
        stream: 'stdout',
      },
    ])
  })
})
