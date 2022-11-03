/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { useColors } from '../src/colors.js'
import { Logger } from '../src/logger/main.js'
import { MemoryRenderer } from '../src/renderers/memory.js'

test.group('Logger | label', () => {
  test('dim labels when dimLabels property is set to true', ({ assert }) => {
    const logger = new Logger({ dimLabels: true })
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.success('Hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ dim(green(success)) ] Hello world`,
        stream: 'stdout',
      },
    ])
  })

  test('dim labels when dim property is set to true', ({ assert }) => {
    const logger = new Logger({ dim: true })
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.success('Hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ dim(green(success)) ] dim(Hello world)`,
        stream: 'stdout',
      },
    ])
  })
})

test.group('Logger | success', () => {
  test('log success message with icon', ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.success('Hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ green(success) ] Hello world`,
        stream: 'stdout',
      },
    ])
  })
})

test.group('Logger | error', () => {
  test('log error message with label', ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.error('Hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ red(error) ] Hello world`,
        stream: 'stderr',
      },
    ])
  })

  test('log error instance as error', ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.error(new Error('Hello world'))

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ red(error) ] Hello world`,
        stream: 'stderr',
      },
    ])
  })
})

test.group('Logger | fatal', () => {
  test('log fatal message with icon', ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.fatal('Hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ red(error) ] Hello world`,
        stream: 'stderr',
      },
    ])
  })

  test('log error instance as a fatal message', ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.fatal(new Error('Hello world'))

    assert.lengthOf(renderer.getLogs(), 1)

    assert.equal(renderer.getLogs()[0].stream, 'stderr')
    assert.equal(
      renderer.getLogs()[0].message.split('\n')[1],
      `      red(    at Object.executor (${import.meta.url}:124:18))`
    )
  })
})

test.group('Logger | warning', () => {
  test('log warning message with icon', ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.warning('Hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ yellow(warn) ] Hello world`,
        stream: 'stdout',
      },
    ])
  })
})

test.group('Logger | info', () => {
  test('log info message with icon', ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.info('Hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ blue(info) ] Hello world`,
        stream: 'stdout',
      },
    ])
  })
})

test.group('Logger | debug', () => {
  test('log debug message with icon', ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.debug('Hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ cyan(debug) ] Hello world`,
        stream: 'stdout',
      },
    ])
  })
})

test.group('Logger | await', () => {
  test('start spinner', ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    const spinner = logger.await('installing')
    spinner.start()
    spinner.stop()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ cyan(wait) ] installing .  `,
        stream: 'stdout',
      },
      {
        message: `[ cyan(wait) ] installing ...`,
        stream: 'stdout',
      },
    ])
  })

  test('start spinner with a custom prefix', ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    const spinner = logger.await('installing', { prefix: 'npm' })
    spinner.start()
    spinner.stop()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `dim([npm]) [ cyan(wait) ] installing .  `,
        stream: 'stdout',
      },
      {
        message: `dim([npm]) [ cyan(wait) ] installing ...`,
        stream: 'stdout',
      },
    ])
  })

  test('updating spinner text must retain the prefix', async ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    const spinner = logger.await('installing', { prefix: 'npm' })
    spinner.start()
    spinner.update('updating')

    /**
     * Sleep until next interval of 200 milliseconds + little buffer
     */
    await new Promise((resolve) => setTimeout(resolve, 210))
    spinner.stop()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `dim([npm]) [ cyan(wait) ] installing .  `,
        stream: 'stdout',
      },
      {
        message: `dim([npm]) [ cyan(wait) ] updating .. `,
        stream: 'stdout',
      },
      {
        message: `dim([npm]) [ cyan(wait) ] updating ...`,
        stream: 'stdout',
      },
    ])
  })

  test('update spinner with new prefix', async ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))

    const spinner = logger.await('installing', { prefix: 'npm' })
    spinner.start()
    spinner.update('updating', { prefix: 'fs' })

    /**
     * Sleep until next interval of 200 milliseconds + little buffer
     */
    await new Promise((resolve) => setTimeout(resolve, 210))
    spinner.stop()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `dim([npm]) [ cyan(wait) ] installing .  `,
        stream: 'stdout',
      },
      {
        message: `dim([fs]) [ cyan(wait) ] updating .. `,
        stream: 'stdout',
      },
      {
        message: `dim([fs]) [ cyan(wait) ] updating ...`,
        stream: 'stdout',
      },
    ])
  })

  test('start spinner with a custom suffix', ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))

    const spinner = logger.await('installing', { suffix: 'npm' })
    spinner.start()
    spinner.stop()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ cyan(wait) ] installing dim(yellow((npm))) .  `,
        stream: 'stdout',
      },
      {
        message: `[ cyan(wait) ] installing dim(yellow((npm))) ...`,
        stream: 'stdout',
      },
    ])
  })

  test('updating spinner text must retain the suffix', async ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))

    const spinner = logger.await('installing', { suffix: 'npm' })
    spinner.start()
    spinner.update('updating')

    /**
     * Sleep until next interval of 200 milliseconds + little buffer
     */
    await new Promise((resolve) => setTimeout(resolve, 210))
    spinner.stop()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ cyan(wait) ] installing dim(yellow((npm))) .  `,
        stream: 'stdout',
      },
      {
        message: `[ cyan(wait) ] updating dim(yellow((npm))) .. `,
        stream: 'stdout',
      },
      {
        message: `[ cyan(wait) ] updating dim(yellow((npm))) ...`,
        stream: 'stdout',
      },
    ])
  })

  test('update spinner with new suffix', async ({ assert }) => {
    const logger = new Logger({})
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))

    const spinner = logger.await('installing', { suffix: 'npm' })
    spinner.start()
    spinner.update('updating', { suffix: 'fs' })

    /**
     * Sleep until next interval of 200 milliseconds + little buffer
     */
    await new Promise((resolve) => setTimeout(resolve, 210))

    spinner.stop()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ cyan(wait) ] installing dim(yellow((npm))) .  `,
        stream: 'stdout',
      },
      {
        message: `[ cyan(wait) ] updating dim(yellow((fs))) .. `,
        stream: 'stdout',
      },
      {
        message: `[ cyan(wait) ] updating dim(yellow((fs))) ...`,
        stream: 'stdout',
      },
    ])
  })

  test('log using the child logger', ({ assert }) => {
    const logger = new Logger()
    const renderer = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.success('Hello world')
    logger.child({ dimLabels: true }).success('Hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ green(success) ] Hello world`,
        stream: 'stdout',
      },
      {
        message: `[ dim(green(success)) ] Hello world`,
        stream: 'stdout',
      },
    ])
  })

  test('assign different renderer to the child logger', ({ assert }) => {
    const logger = new Logger()
    const renderer = new MemoryRenderer()
    const renderer1 = new MemoryRenderer()

    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))
    logger.success('Hello world')
    logger.child({ dimLabels: true }).useRenderer(renderer1).success('Hello world')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: `[ green(success) ] Hello world`,
        stream: 'stdout',
      },
    ])

    assert.deepEqual(renderer1.getLogs(), [
      {
        message: `[ dim(green(success)) ] Hello world`,
        stream: 'stdout',
      },
    ])
  })
})
