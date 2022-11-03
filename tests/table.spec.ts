/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Table } from '../src/table.js'
import { useColors } from '../src/colors.js'
import { MemoryRenderer } from '../src/renderers/memory.js'

test.group('Table', () => {
  test('render table', ({ assert }) => {
    const table = new Table({ raw: true })
    const renderer = new MemoryRenderer()

    table.useRenderer(renderer)
    table.useColors(useColors({ raw: true }))
    table.head(['name', 'profession'])
    table.row(['virk', 'engineer'])

    table.render()
    assert.deepEqual(renderer.getLogs(), [
      {
        message: 'name|profession',
        stream: 'stdout',
      },
      {
        message: 'virk|engineer',
        stream: 'stdout',
      },
    ])
  })

  test('render table with mutliple rows', ({ assert }) => {
    const table = new Table({ raw: true })
    const renderer = new MemoryRenderer()

    table.useRenderer(renderer)
    table.useColors(useColors({ raw: true }))

    table.head(['name', 'profession'])
    table.row(['virk', 'engineer'])
    table.row(['romain', 'engineer'])

    table.render()
    assert.deepEqual(renderer.getLogs(), [
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

  test('disable colors', ({ assert }) => {
    const table = new Table({ raw: true })
    const renderer = new MemoryRenderer()

    table.useRenderer(renderer)
    table.useColors(useColors({ silent: true }))

    table.head(['name', 'profession'])
    table.row(['virk', 'engineer'])
    table.row(['romain', 'engineer'])

    table.render()
    assert.deepEqual(renderer.getLogs(), [
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

  test('render table head from object', ({ assert }) => {
    const table = new Table({ raw: true })
    const renderer = new MemoryRenderer()

    table.useRenderer(renderer)
    table.useColors(useColors({ raw: true }))
    table.head([{ content: 'name' }, { content: 'profession' }])
    table.row(['virk', 'engineer'])

    table.render()
    assert.deepEqual(renderer.getLogs(), [
      {
        message: 'name|profession',
        stream: 'stdout',
      },
      {
        message: 'virk|engineer',
        stream: 'stdout',
      },
    ])
  })

  test('render table row from object', ({ assert }) => {
    const table = new Table({ raw: true })
    const renderer = new MemoryRenderer()

    table.useRenderer(renderer)
    table.useColors(useColors({ raw: true }))
    table.head([{ content: 'name' }, { content: 'profession' }])
    table.row([{ content: 'virk' }, { content: 'engineer' }])

    table.render()
    assert.deepEqual(renderer.getLogs(), [
      {
        message: 'name|profession',
        stream: 'stdout',
      },
      {
        message: 'virk|engineer',
        stream: 'stdout',
      },
    ])
  })
})
