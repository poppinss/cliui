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
import { MemoryRenderer } from '../src/Renderer/Memory'

test.group('Logger | icons', () => {
	test('do not add color to icon when iconColors property is set to false', (assert) => {
		const logger = new Logger({ iconColors: false }, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.success('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `${icons.tick}  Hello world`,
				stream: 'stdout',
			},
		])
	})

	test('do not add color to icon when colors property is set to false', (assert) => {
		const logger = new Logger({ colors: false }, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.success('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `${icons.tick}  Hello world`,
				stream: 'stdout',
			},
		])
	})

	test('dim icons when dimIcons property is set to true', (assert) => {
		const logger = new Logger({ dimIcons: true }, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.success('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `dim(green(${icons.tick}))  Hello world`,
				stream: 'stdout',
			},
		])
	})

	test('dim icons when dim property is set to true', (assert) => {
		const logger = new Logger({ dim: true }, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.success('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `dim(green(${icons.tick}))  dim(Hello world)`,
				stream: 'stdout',
			},
		])
	})

	test('do not set icons when icons are disabled', (assert) => {
		const logger = new Logger({ icons: false }, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.success('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `Hello world`,
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
				message: `green(${icons.tick})  Hello world`,
				stream: 'stdout',
			},
		])
	})
})

test.group('Logger | error', () => {
	test('log error message with icon', (assert) => {
		const logger = new Logger({}, true)
		const renderer = new MemoryRenderer()

		logger.useRenderer(renderer)
		logger.error('Hello world')

		assert.deepEqual(renderer.logs, [
			{
				message: `red(${icons.cross})  Hello world`,
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
				message: `red(${icons.cross})  Hello world`,
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
				message: `red(${icons.cross})  Hello world`,
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
		assert.equal(renderer.logs[0].message.split('\n')[1], `dim(    at ${__filename}:163:16)`)
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
				message: `yellow(${icons.warning})  Hello world`,
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
				message: `blue(${icons.info})  Hello world`,
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
				message: `cyan(${icons.bullet})  Hello world`,
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
				message: `yellow(${icons.squareSmallFilled})  installing ...`,
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
				message: `gray([npm]) yellow(${icons.squareSmallFilled})  installing ...`,
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
				message: `gray([npm]) yellow(${icons.squareSmallFilled})  installing ...`,
				stream: 'stdout',
			},
			{
				message: `gray([npm]) yellow(${icons.squareSmallFilled})  updating ...`,
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
				message: `gray([npm]) yellow(${icons.squareSmallFilled})  installing ...`,
				stream: 'stdout',
			},
			{
				message: `gray([fs]) yellow(${icons.squareSmallFilled})  updating ...`,
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
				message: `yellow(${icons.squareSmallFilled})  installing dim(yellow((npm))) ...`,
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
				message: `yellow(${icons.squareSmallFilled})  installing dim(yellow((npm))) ...`,
				stream: 'stdout',
			},
			{
				message: `yellow(${icons.squareSmallFilled})  updating dim(yellow((npm))) ...`,
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
				message: `yellow(${icons.squareSmallFilled})  installing dim(yellow((npm))) ...`,
				stream: 'stdout',
			},
			{
				message: `yellow(${icons.squareSmallFilled})  updating dim(yellow((fs))) ...`,
				stream: 'stdout',
			},
		])
	})
})
