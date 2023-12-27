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
import { TaskManager } from '../src/tasks/manager.js'
import { MemoryRenderer } from '../src/renderers/memory.js'

test.group('TaskManager', () => {
  test('run multiple tasks in sequence', async ({ assert }) => {
    const renderer = new MemoryRenderer()

    const manager = new TaskManager({ verbose: true })
    manager.useRenderer(renderer)
    manager.useColors(useColors({ raw: true }))

    const logger = new Logger()
    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))

    await manager
      .add('task 1', async () => {
        assert.equal(manager.getState(), 'running')
        logger.log('log task 1')
        return ''
      })
      .add('task 2', async () => {
        assert.equal(manager.getState(), 'running')
        logger.log('log task 2')
        return ''
      })
      .run()

    assert.equal(manager.getState(), 'succeeded')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: 'dim(┌ )task 1',
        stream: 'stdout',
      },
      {
        message: 'log task 1',
        stream: 'stdout',
      },
      {
        message: renderer.getLogs()[2].message,
        stream: 'stdout',
      },
      {
        message: 'dim(┌ )task 2',
        stream: 'stdout',
      },
      {
        message: 'log task 2',
        stream: 'stdout',
      },
      {
        message: renderer.getLogs()[5].message,
        stream: 'stdout',
      },
    ])
  })

  test('add tasks conditionally', async ({ assert }) => {
    const renderer = new MemoryRenderer()

    const manager = new TaskManager({ verbose: true })
    manager.useRenderer(renderer)
    manager.useColors(useColors({ raw: true }))

    const logger = new Logger()
    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))

    await manager
      .add('task 1', async () => {
        assert.equal(manager.getState(), 'running')
        logger.log('log task 1')
        return ''
      })
      .addIf(true, 'task 2', async () => {
        assert.equal(manager.getState(), 'running')
        logger.log('log task 2')
        return ''
      })
      .addIf(false, 'task 3', async () => {
        assert.equal(manager.getState(), 'running')
        logger.log('log task 3')
        return ''
      })
      .addUnless(false, 'task 4', async () => {
        assert.equal(manager.getState(), 'running')
        logger.log('log task 4')
        return ''
      })
      .run()

    assert.equal(manager.getState(), 'succeeded')

    assert.deepEqual(renderer.getLogs(), [
      {
        message: 'dim(┌ )task 1',
        stream: 'stdout',
      },
      {
        message: 'log task 1',
        stream: 'stdout',
      },
      {
        message: renderer.getLogs()[2].message,
        stream: 'stdout',
      },
      {
        message: 'dim(┌ )task 2',
        stream: 'stdout',
      },
      {
        message: 'log task 2',
        stream: 'stdout',
      },
      {
        message: renderer.getLogs()[5].message,
        stream: 'stdout',
      },
      {
        message: 'dim(┌ )task 4',
        stream: 'stdout',
      },
      {
        message: 'log task 4',
        stream: 'stdout',
      },
      {
        message: renderer.getLogs()[8].message,
        stream: 'stdout',
      },
    ])
  })

  test('do not run next task when previous one fails', async ({ assert }) => {
    const renderer = new MemoryRenderer()

    const manager = new TaskManager({ verbose: true })
    manager.useRenderer(renderer)
    manager.useColors(useColors({ raw: true }))

    const logger = new Logger()
    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))

    await manager
      .add('task 1', async () => {
        assert.equal(manager.getState(), 'running')
        logger.log('log task 1')
        return ''
      })
      .add('task 2', async (task) => {
        assert.equal(manager.getState(), 'running')
        logger.log('log task 2')
        return task.error('Something went wrong')
      })
      .add('task 3', async () => {
        logger.log('log task 3')
        return ''
      })
      .run()

    assert.equal(manager.getState(), 'failed')
    assert.deepEqual(
      manager
        .tasks()
        .find((t) => !!t.getError())!
        .getError(),
      { message: 'Something went wrong', isError: true }
    )

    assert.deepEqual(renderer.getLogs(), [
      {
        message: 'dim(┌ )task 1',
        stream: 'stdout',
      },
      {
        message: 'log task 1',
        stream: 'stdout',
      },
      {
        message: renderer.getLogs()[2].message,
        stream: 'stdout',
      },
      {
        message: 'dim(┌ )task 2',
        stream: 'stdout',
      },
      {
        message: 'log task 2',
        stream: 'stdout',
      },
      {
        message: 'dim(│ )red(Something went wrong)',
        stream: 'stderr',
      },
      {
        message: renderer.getLogs()[6].message,
        stream: 'stderr',
      },
    ])
  })

  test('handle exceptions to auto fail the tasks', async ({ assert }) => {
    const renderer = new MemoryRenderer()

    const manager = new TaskManager({ verbose: true })
    manager.useRenderer(renderer)
    manager.useColors(useColors({ raw: true }))

    const logger = new Logger()
    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))

    await manager
      .add('task 1', async () => {
        assert.equal(manager.getState(), 'running')
        logger.log('log task 1')
        return ''
      })
      .add('task 2', async () => {
        assert.equal(manager.getState(), 'running')
        logger.log('log task 2')
        throw new Error('Something went wrong')
      })
      .add('task 3', async () => {
        logger.log('log task 3')
        return ''
      })
      .run()

    assert.equal(manager.getState(), 'failed')
    assert.containsSubset(
      manager
        .tasks()
        .find((t) => !!t.getError())!
        .getError(),
      { message: 'Something went wrong' }
    )

    assert.deepEqual(renderer.getLogs(), [
      {
        message: 'dim(┌ )task 1',
        stream: 'stdout',
      },
      {
        message: 'log task 1',
        stream: 'stdout',
      },
      {
        message: renderer.getLogs()[2].message,
        stream: 'stdout',
      },
      {
        message: 'dim(┌ )task 2',
        stream: 'stdout',
      },
      {
        message: 'log task 2',
        stream: 'stdout',
      },
      {
        message: renderer.getLogs()[5].message,
        stream: 'stderr',
      },
      {
        message: renderer.getLogs()[6].message,
        stream: 'stderr',
      },
    ])
  })

  test('disable colors', async ({ assert }) => {
    const renderer = new MemoryRenderer()

    const manager = new TaskManager({ verbose: true })
    manager.useRenderer(renderer)
    manager.useColors(useColors({ silent: true }))

    const logger = new Logger()
    logger.useRenderer(renderer)
    logger.useColors(useColors({ raw: true }))

    await manager
      .add('task 1', async () => {
        logger.log('log task 1')
        return ''
      })
      .add('task 2', async (task) => {
        logger.log('log task 2')
        return task.error('Something went wrong')
      })
      .add('task 3', async () => {
        logger.log('log task 3')
        return ''
      })
      .run()

    assert.deepEqual(renderer.getLogs(), [
      {
        message: '┌ task 1',
        stream: 'stdout',
      },
      {
        message: 'log task 1',
        stream: 'stdout',
      },
      {
        message: renderer.getLogs()[2].message,
        stream: 'stdout',
      },
      {
        message: '┌ task 2',
        stream: 'stdout',
      },
      {
        message: 'log task 2',
        stream: 'stdout',
      },
      {
        message: `│ Something went wrong`,
        stream: 'stderr',
      },
      {
        message: renderer.getLogs()[6].message,
        stream: 'stderr',
      },
    ])
  })
})
