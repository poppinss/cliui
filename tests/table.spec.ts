/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { stripVTControlCharacters } from 'node:util'
import { Table } from '../src/table.js'
import { useColors } from '../src/colors.js'
import { MemoryRenderer } from '../src/renderers/memory.js'

test.group('Table', () => {
  test('render a minimal table with colored headings', ({ assert }) => {
    const table = new Table({ minimal: true })
    const renderer = new MemoryRenderer()
    const colors = useColors()

    table.useRenderer(renderer)
    table.useColors(colors)
    table.head([colors.cyan('Name'), colors.cyan('Status')])
    table.row(['cliui', 'Ready'])
    table.row(['prompts', 'Ready'])
    table.render()

    const output = renderer.getLogs()[0].message
    assert.include(output, colors.cyan('Name'))
    assert.include(output, colors.cyan('Status'))
    assert.equal(
      stripVTControlCharacters(output),
      ['Name     Status', '───────  ──────', 'cliui    Ready ', 'prompts  Ready '].join('\n')
    )
  })

  test('render a compact table with rounded borders', ({ assert }) => {
    const table = new Table()
    const renderer = new MemoryRenderer()

    table.useRenderer(renderer)
    table.useColors(useColors({ silent: true }))
    table.head(['Name', 'Status'])
    table.row(['cliui', 'Ready'])
    table.render()

    assert.equal(
      stripVTControlCharacters(renderer.getLogs()[0].message),
      [
        '╭───────┬────────╮',
        '│ Name  │ Status │',
        '├───────┼────────┤',
        '│ cliui │ Ready  │',
        '╰───────┴────────╯',
      ].join('\n')
    )
  })

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
