/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
// import { icons } from '../src/Icons'
import { TaskManager } from '../src/Task/Manager'
import { MemoryRenderer } from '../src/Renderer/Memory'

test.group('TaskManager', () => {
	test('run multiple tasks in sequence', async (assert) => {
		const renderer = new MemoryRenderer()
		const manager = new TaskManager({}, true)

		await manager
			.useRenderer(renderer)
			.add('task 1', async (logger, task) => {
				assert.equal(manager.state, 'running')
				logger.log('log task 1')
				await task.complete()
			})
			.add('task 2', async (logger, task) => {
				assert.equal(manager.state, 'running')
				logger.log('log task 2')
				await task.complete()
			})
			.run()

		assert.equal(manager.state, 'succeeded')
		assert.deepEqual(renderer.logs, [
			{
				message: 'dim(┌) task 1',
				stream: 'stdout',
			},
			{
				message: 'dim(│)  log task 1',
				stream: 'stdout',
			},
			{
				message: renderer.logs[2].message,
				stream: 'stdout',
			},
			{
				message: 'dim(┌) task 2',
				stream: 'stdout',
			},
			{
				message: 'dim(│)  log task 2',
				stream: 'stdout',
			},
			{
				message: renderer.logs[5].message,
				stream: 'stdout',
			},
		])
	})

	test('do not run next task when previous one fails', async (assert) => {
		const renderer = new MemoryRenderer()
		const manager = new TaskManager({}, true)

		await manager
			.useRenderer(renderer)
			.add('task 1', async (logger, task) => {
				assert.equal(manager.state, 'running')
				logger.log('log task 1')
				await task.complete()
			})
			.add('task 2', async (logger, task) => {
				assert.equal(manager.state, 'running')
				logger.log('log task 2')
				await task.fail('Something went wrong')
			})
			.add('task 3', async (logger, task) => {
				logger.log('log task 3')
				await task.complete()
			})
			.run()

		assert.equal(manager.state, 'failed')
		assert.equal(manager.error, 'Something went wrong')
		assert.deepEqual(renderer.logs, [
			{
				message: 'dim(┌) task 1',
				stream: 'stdout',
			},
			{
				message: 'dim(│)  log task 1',
				stream: 'stdout',
			},
			{
				message: renderer.logs[2].message,
				stream: 'stdout',
			},
			{
				message: 'dim(┌) task 2',
				stream: 'stdout',
			},
			{
				message: 'dim(│)  log task 2',
				stream: 'stdout',
			},
			{
				message: `dim(│)  [ dim(red(error)) ]  dim(Something went wrong)`,
				stream: 'stderr',
			},
			{
				message: renderer.logs[6].message,
				stream: 'stderr',
			},
		])
	})

	test('handle exceptions to auto fail the tasks', async (assert) => {
		const renderer = new MemoryRenderer()
		const manager = new TaskManager({}, true)

		await manager
			.useRenderer(renderer)
			.add('task 1', async (logger, task) => {
				assert.equal(manager.state, 'running')
				logger.log('log task 1')
				await task.complete()
			})
			.add('task 2', async (logger) => {
				assert.equal(manager.state, 'running')
				logger.log('log task 2')
				throw new Error('Something went wrong')
			})
			.add('task 3', async (logger, task) => {
				logger.log('log task 3')
				await task.complete()
			})
			.run()

		assert.equal(manager.state, 'failed')
		assert.equal(manager.error.message, 'Something went wrong')
		assert.deepEqual(renderer.logs, [
			{
				message: 'dim(┌) task 1',
				stream: 'stdout',
			},
			{
				message: 'dim(│)  log task 1',
				stream: 'stdout',
			},
			{
				message: renderer.logs[2].message,
				stream: 'stdout',
			},
			{
				message: 'dim(┌) task 2',
				stream: 'stdout',
			},
			{
				message: 'dim(│)  log task 2',
				stream: 'stdout',
			},
			{
				message: renderer.logs[5].message,
				stream: 'stderr',
			},
			{
				message: renderer.logs[6].message,
				stream: 'stderr',
			},
		])
	})

	test('disable colors', async (assert) => {
		const renderer = new MemoryRenderer()
		const manager = new TaskManager({ colors: false }, true)

		await manager
			.useRenderer(renderer)
			.add('task 1', async (logger, task) => {
				logger.log('log task 1')
				await task.complete()
			})
			.add('task 2', async (logger, task) => {
				logger.log('log task 2')
				await task.fail('Something went wrong')
			})
			.add('task 3', async (logger, task) => {
				logger.log('log task 3')
				await task.complete()
			})
			.run()

		assert.deepEqual(renderer.logs, [
			{
				message: '┌ task 1',
				stream: 'stdout',
			},
			{
				message: '│  log task 1',
				stream: 'stdout',
			},
			{
				message: renderer.logs[2].message,
				stream: 'stdout',
			},
			{
				message: '┌ task 2',
				stream: 'stdout',
			},
			{
				message: '│  log task 2',
				stream: 'stdout',
			},
			{
				message: `│  [ error ]  Something went wrong`,
				stream: 'stderr',
			},
			{
				message: renderer.logs[6].message,
				stream: 'stderr',
			},
		])
	})
})
