/*
* @poppinss/utils
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import test from 'japa'
import hookStd from 'hook-std'
import { Spinner } from '../src/Spinner'

test.group('Spinner', () => {
	test('print the message with progress bar', async (assert) => {
		const spinner = new Spinner('hello world', true)
		const fn = hookStd.stdout((output, unhook) => {
			unhook()
			assert.equal(output.trim(), 'hello world ...')
		})

		spinner.start()
		await fn
	})

	test('update message on the update call', async (assert) => {
		const spinner = new Spinner('hello world', true)
		spinner.start()

		const fn = hookStd.stdout((output, unhook) => {
			unhook()
			assert.equal(output.trim(), 'hi world ...')
		})

		spinner.update('hi world')
		await fn
	})

	test('stop should be a noop', async (assert) => {
		const spinner = new Spinner('hello world', true)

		const fn = hookStd.stdout((output, unhook) => {
			unhook()
			assert.equal(output.trim(), 'hello world ...')
		})

		spinner.start()
		spinner.stop()
		await fn
	})
})
