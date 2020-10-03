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
import { MemoryRenderer } from '../src/Renderer/Memory'

test.group('Logger | label', () => {
	test('do not add color to label when labelColors property is set to false', (assert) => {
		const logger = new Logger({ labelColors: false }, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.success('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `[ success ]  Hello world`,
				stream: 'stdout',
			},
		])
	})

	test('do not add color to label when colors property is set to false', (assert) => {
		const logger = new Logger({ colors: false }, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.success('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `[ success ]  Hello world`,
				stream: 'stdout',
			},
		])
	})

	test('dim labels when dimLabels property is set to true', (assert) => {
		const logger = new Logger({ dimLabels: true }, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.success('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `[ dim(green(success)) ]  Hello world`,
				stream: 'stdout',
			},
		])
	})

	test('dim labels when dim property is set to true', (assert) => {
		const logger = new Logger({ dim: true }, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.success('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `[ dim(green(success)) ]  dim(Hello world)`,
				stream: 'stdout',
			},
		])
	})
})

test.group('Logger | success', () => {
	test('log success message with icon', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.success('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `[ green(success) ]  Hello world`,
				stream: 'stdout',
			},
		])
	})
})

test.group('Logger | error', () => {
	test('log error message with label', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.error('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `[ red(error) ]  Hello world`,
				stream: 'stderr',
			},
		])
	})

	test('log error instance as error', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.error(new Error('Hello world'))

		assert.deepEqual(renderer.logs, [
			{
				message: `[ red(error) ]  Hello world`,
				stream: 'stderr',
			},
		])
	})
})

test.group('Logger | fatal', () => {
	test('log fatal message with icon', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.fatal('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `[ red(error) ]  Hello world`,
				stream: 'stderr',
			},
		])
	})

	test('log error instance as a fatal message', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.fatal(new Error('Hello world'))

		assert.lengthOf(renderer.logs, 1)
		assert.equal(renderer.logs[0].stream, 'stderr')
		assert.equal(renderer.logs[0].message.split('\n')[1], `dim(    at ${__filename}:146:16)`)
	})
})

test.group('Logger | warning', () => {
	test('log warning message with icon', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.warning('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `[ yellow(warn) ]  Hello world`,
				stream: 'stdout',
			},
		])
	})
})

test.group('Logger | info', () => {
	test('log info message with icon', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.info('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `[ blue(info) ]  Hello world`,
				stream: 'stdout',
			},
		])
	})
})

test.group('Logger | debug', () => {
	test('log debug message with icon', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.debug('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `[ cyan(debug) ]  Hello world`,
				stream: 'stdout',
			},
		])
	})
})

test.group('Logger | await', () => {
	test('start spinner', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		const spinner = logger.await('installing')
		spinner.stop()

		assert.deepEqual(renderer.logs, [
			{
				message: `[ cyan(wait) ]  installing ...`,
				stream: 'stdout',
			},
		])
	})

	test('start spinner with a custom prefix', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		const spinner = logger.await('installing', 'npm')
		spinner.stop()

		assert.deepEqual(renderer.logs, [
			{
				message: `dim([npm]) [ cyan(wait) ]  installing ...`,
				stream: 'stdout',
			},
		])
	})

	test('updating spinner text must retain the prefix', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		const spinner = logger.await('installing', 'npm')
		spinner.update('updating')
		spinner.stop()

		assert.deepEqual(renderer.logs, [
			{
				message: `dim([npm]) [ cyan(wait) ]  installing ...`,
				stream: 'stdout',
			},
			{
				message: `dim([npm]) [ cyan(wait) ]  updating ...`,
				stream: 'stdout',
			},
		])
	})

	test('update spinner with new prefix', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		const spinner = logger.await('installing', 'npm')
		spinner.update('updating', 'fs')
		spinner.stop()

		assert.deepEqual(renderer.logs, [
			{
				message: `dim([npm]) [ cyan(wait) ]  installing ...`,
				stream: 'stdout',
			},
			{
				message: `dim([fs]) [ cyan(wait) ]  updating ...`,
				stream: 'stdout',
			},
		])
	})

	test('start spinner with a custom suffix', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		const spinner = logger.await('installing', undefined, 'npm')
		spinner.stop()

		assert.deepEqual(renderer.logs, [
			{
				message: `[ cyan(wait) ]  installing dim(yellow((npm))) ...`,
				stream: 'stdout',
			},
		])
	})

	test('updating spinner text must retain the suffix', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		const spinner = logger.await('installing', undefined, 'npm')
		spinner.update('updating')
		spinner.stop()

		assert.deepEqual(renderer.logs, [
			{
				message: `[ cyan(wait) ]  installing dim(yellow((npm))) ...`,
				stream: 'stdout',
			},
			{
				message: `[ cyan(wait) ]  updating dim(yellow((npm))) ...`,
				stream: 'stdout',
			},
		])
	})

	test('update spinner with new suffix', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		const spinner = logger.await('installing', undefined, 'npm')
		spinner.update('updating', undefined, 'fs')
		spinner.stop()

		assert.deepEqual(renderer.logs, [
			{
				message: `[ cyan(wait) ]  installing dim(yellow((npm))) ...`,
				stream: 'stdout',
			},
			{
				message: `[ cyan(wait) ]  updating dim(yellow((fs))) ...`,
				stream: 'stdout',
			},
		])
	})
})
