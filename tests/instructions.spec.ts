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
        message: `dim(${icons.pointer}) hello world`,
        stream: 'stdout',
      },
      {
        message: `dim(${icons.pointer}) hi world`,
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
        message: 'hey',
        stream: 'stdout',
      },
      {
        message: `dim(${icons.pointer}) hello world`,
        stream: 'stdout',
      },
      {
        message: `dim(${icons.pointer}) hi world`,
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
        message: 'hey',
        stream: 'stdout',
      },
      {
        message: `hello world`,
        stream: 'stdout',
      },
      {
        message: `hi world`,
        stream: 'stdout',
      },
    ])
  })
})
