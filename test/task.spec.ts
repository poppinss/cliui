/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { Task } from '../src/Task'

test.group('Task', () => {
	test('initiate task in idle mode', (assert) => {
		const task = new Task('install deps')
		assert.equal(task.state, 'idle')
	})

	test('starting a task should notify listener', (assert, done) => {
		assert.plan(1)

		const task = new Task('install deps')
		task.onUpdate(($task) => {
			assert.equal($task.state, 'running')
			done()
		})

		task.start()
	})

	test('update task state to running after calling the start method', (assert) => {
		assert.plan(1)

		const task = new Task('install deps')
		task.start()

		assert.equal(task.state, 'running')
	})

	test('mark test as completed', (assert, done) => {
		assert.plan(1)

		const task = new Task('install deps')
		task.start()

		task.onUpdate(($task) => {
			assert.equal($task.state, 'succeeded')
			done()
		})

		task.complete()
	})

	test('mark test as completed with summary', (assert, done) => {
		assert.plan(2)

		const task = new Task('install deps')
		task.start()

		task.onUpdate(($task) => {
			assert.equal($task.state, 'succeeded')
			assert.equal($task.completionMessage, 'All good')
			done()
		})

		task.complete('All good')
	})

	test('mark test as failed', (assert, done) => {
		assert.plan(2)

		const task = new Task('install deps')
		task.start()

		task.onUpdate(($task) => {
			assert.equal($task.state, 'failed')
			assert.equal($task.completionMessage, 'Something went wrong')
			done()
		})

		task.fail('Something went wrong')
	})

	test('pass error instance as task failure message', (assert, done) => {
		assert.plan(2)

		const task = new Task('install deps')
		task.start()

		task.onUpdate(($task) => {
			assert.equal($task.state, 'failed')
			assert.equal(($task.completionMessage as Error).message, 'Something went wrong')
			done()
		})

		task.fail(new Error('Something went wrong'))
	})
})
