/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'

import { icons } from '../src/Icons'
import { Logger } from '../src/Logger'
import { Action } from '../src/Logger/Action'
import { MemoryRenderer } from '../src/Renderer/Memory'

test.group('Action', () => {
	test('log action in succeeded state', (assert) => {
		const action = new Action('create', new Logger({}, true))
		const renderer = new MemoryRenderer()

		action.useRenderer(renderer)
		action.succeeded('hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `green(${icons.tick})  underline(green(create)) hello world`,
				stream: 'stdout',
			},
		])
	})

	test('log action in failed state', (assert) => {
		const action = new Action('create', new Logger({}, true))
		const renderer = new MemoryRenderer()

		action.useRenderer(renderer)
		action.failed('hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `red(${icons.cross})  underline(red(create)) hello world`,
				stream: 'stderr',
			},
		])
	})

	test('log action in skipped state', (assert) => {
		const action = new Action('create', new Logger({}, true))
		const renderer = new MemoryRenderer()

		action.useRenderer(renderer)
		action.skipped('hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `cyan(${icons.bullet})  underline(cyan(skip)) hello world`,
				stream: 'stdout',
			},
		])
	})

	test('disable colors', (assert) => {
		const action = new Action('create', new Logger({ colors: false }, true))
		const renderer = new MemoryRenderer()

		action.useRenderer(renderer)
		action.succeeded('hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `${icons.tick}  [create] hello world`,
				stream: 'stdout',
			},
		])
	})

	test('dim message', (assert) => {
		const action = new Action('create', new Logger({ dim: true }, true))
		const renderer = new MemoryRenderer()

		action.useRenderer(renderer)
		action.succeeded('hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `dim(green(${icons.tick}))  dim(underline(green(create)) hello world)`,
				stream: 'stdout',
			},
		])
	})
})
