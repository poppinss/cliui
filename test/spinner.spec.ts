/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { Logger } from '../src/Logger'
import { Spinner } from '../src/Logger/Spinner'
import { MemoryRenderer } from '../src/Renderer/Memory'

test.group('Spinner', () => {
	test('print the message with progress bar', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		const spinner = new Spinner('hello world', logger, true)
		spinner.start()

		assert.deepEqual(renderer.logs, [
			{
				message: 'hello world ...',
				stream: 'stdout',
			},
		])
	})

	test('update message on the update call', async (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		const spinner = new Spinner('hello world', logger, true)

		spinner.start()
		spinner.update('hi world')

		assert.deepEqual(renderer.logs, [
			{
				message: 'hello world ...',
				stream: 'stdout',
			},
			{
				message: 'hi world ...',
				stream: 'stdout',
			},
		])
	})

	test('stop in test mode must be a noop', async (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		const spinner = new Spinner('hello world', logger, true)
		spinner.start()
		spinner.stop()

		assert.deepEqual(renderer.logs, [
			{
				message: 'hello world ...',
				stream: 'stdout',
			},
		])
	})
})
