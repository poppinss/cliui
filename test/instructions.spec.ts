/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'

import { icons } from '../src/Icons'
import { Instructions } from '../src/Instructions'
import { MemoryRenderer } from '../src/Renderer/Memory'

test.group('Instructions', () => {
  test('render instruction line', (assert) => {
    const instructions = new Instructions({}, true)
    const renderer = new MemoryRenderer()

    instructions.useRenderer(renderer)
    instructions.add('hello world')
    instructions.render()

    assert.deepEqual(renderer.logs, [
      {
        message: `dim(${icons.pointer}) hello world`,
        stream: 'stdout',
      },
    ])
  })

  test('render multiple instruction lines', (assert) => {
    const instructions = new Instructions({}, true)
    const renderer = new MemoryRenderer()

    instructions.useRenderer(renderer)
    instructions.add('hello world')
    instructions.add('hi world')
    instructions.render()

    assert.deepEqual(renderer.logs, [
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

  test('render instruction heading', (assert) => {
    const instructions = new Instructions({}, true)
    const renderer = new MemoryRenderer()

    instructions.useRenderer(renderer)
    instructions.heading('hey')
    instructions.add('hello world')
    instructions.add('hi world')
    instructions.render()

    assert.deepEqual(renderer.logs, [
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

  test('disable icons', (assert) => {
    const instructions = new Instructions({ icons: false }, true)
    const renderer = new MemoryRenderer()

    instructions.useRenderer(renderer)
    instructions.heading('hey')
    instructions.add('hello world')
    instructions.add('hi world')
    instructions.render()

    assert.deepEqual(renderer.logs, [
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
