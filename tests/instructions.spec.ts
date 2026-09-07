/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { icons } from '../src/icons.js'
import { useColors } from '../src/colors.js'
import { Instructions } from '../src/instructions.js'
import { MemoryRenderer } from '../src/renderers/memory.js'

test.group('Instructions', () => {
  test('render instructions using the Clack note layout', ({ assert }) => {
    const instructions = new Instructions()
    const renderer = new MemoryRenderer()

    instructions.useRenderer(renderer)
    instructions.useColors(useColors({ silent: true }))

    instructions.heading('Next steps')
    instructions.add('Run npm install')
    instructions.add('Run npm test')
    instructions.render()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: [
          '◇  Next steps ────────╮',
          '│                     │',
          `│  ${icons.pointer} Run npm install  │`,
          `│  ${icons.pointer} Run npm test     │`,
          '│                     │',
          '╰─────────────────────╯',
        ].join('\n'),
        stream: 'stdout',
      },
    ])
  })

  test('preserve the custom border renderer', ({ assert }) => {
    const instructions = new Instructions()
    const renderer = new MemoryRenderer()

    instructions.useRenderer(renderer)
    instructions.useColors(useColors({ silent: true }))
    instructions.drawBorder((border) => `[${border}]`)
    instructions.add('hello world')
    instructions.render()

    const topBorder = renderer.getLogs()[0].message.split('\n')[0]
    assert.isTrue(topBorder.startsWith('[╭][─]'))
    assert.isTrue(topBorder.endsWith('[╮]'))
  })

  test('render instruction line', ({ assert }) => {
    const instructions = new Instructions({ raw: true })
    const renderer = new MemoryRenderer()

    instructions.useRenderer(renderer)
    instructions.useColors(useColors({ raw: true }))

    instructions.add('hello world')
    instructions.render()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `dim(${icons.pointer}) hello world`,
        stream: 'stdout',
      },
    ])
  })

  test('render multiple instruction lines', ({ assert }) => {
    const instructions = new Instructions({ raw: true })
    const renderer = new MemoryRenderer()

    instructions.useRenderer(renderer)
    instructions.useColors(useColors({ raw: true }))

    instructions.add('hello world')
    instructions.add('hi world')
    instructions.render()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `dim(${icons.pointer}) hello world\ndim(${icons.pointer}) hi world`,
        stream: 'stdout',
      },
    ])
  })

  test('render instruction heading', ({ assert }) => {
    const instructions = new Instructions({ raw: true })
    const renderer = new MemoryRenderer()

    instructions.useRenderer(renderer)
    instructions.useColors(useColors({ raw: true }))

    instructions.heading('hey')
    instructions.add('hello world')
    instructions.add('hi world')
    instructions.render()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `hey\ndim(${icons.pointer}) hello world\ndim(${icons.pointer}) hi world`,
        stream: 'stdout',
      },
    ])
  })

  test('disable icons', ({ assert }) => {
    const instructions = new Instructions({ raw: true, icons: false })
    const renderer = new MemoryRenderer()

    instructions.useRenderer(renderer)
    instructions.useColors(useColors({ raw: true }))

    instructions.heading('hey')
    instructions.add('hello world')
    instructions.add('hi world')
    instructions.render()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `hey\nhello world\nhi world`,
        stream: 'stdout',
      },
    ])
  })
})
