/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'

import { Action } from '../src/Action'
import { MemoryRenderer } from '../src/Renderer/Memory'

test.group('Action', () => {
	test('log action in succeeded state', (assert) => {
		const action = new Action({}, true)
		const renderer = new MemoryRenderer()

		action.useRenderer(renderer)
		action.succeeded('hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: 'underline(green(success))  hello world',
				stream: 'stdout',
			},
		])
	})

	test('log action in failed state', (assert) => {
		const action = new Action({}, true)
		const renderer = new MemoryRenderer()

		action.useRenderer(renderer)
		action.failed('hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: 'underline(red(error))    hello world',
				stream: 'stderr',
			},
		])
	})

	test('log action in skipped state', (assert) => {
		const action = new Action({}, true)
		const renderer = new MemoryRenderer()

		action.useRenderer(renderer)
		action.skipped('hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: 'underline(magenta(skip))     hello world',
				stream: 'stdout',
			},
		])
	})

	test('disable colors', (assert) => {
		const action = new Action({ colors: false }, true)
		const renderer = new MemoryRenderer()

		action.useRenderer(renderer)
		action.succeeded('hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: '[success]  hello world',
				stream: 'stdout',
			},
		])
	})

	test('dim message', (assert) => {
		const action = new Action({ dim: true }, true)
		const renderer = new MemoryRenderer()

		action.useRenderer(renderer)
		action.succeeded('hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: 'dim(underline(green(success)))  dim(hello world)',
				stream: 'stdout',
			},
		])
	})
})
