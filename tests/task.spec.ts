/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Task } from '../src/tasks/task.js'

test.group('Task', () => {
  test('initiate task in idle mode', ({ assert }) => {
    const task = new Task('install deps')
    assert.equal(task.getState(), 'idle')
  })

  test('starting a task should notify listener', ({ assert }, done) => {
    assert.plan(1)

    const task = new Task('install deps')
    task.onUpdate(($task) => {
      assert.equal($task.getState(), 'running')
      done()
    })

    task.start()
  }).waitForDone()

  test('update task state to running after calling the start method', ({ assert }) => {
    assert.plan(1)

    const task = new Task('install deps')
    task.start()

    assert.equal(task.getState(), 'running')
  })

  test('mark test as completed', ({ assert }, done) => {
    assert.plan(1)

    const task = new Task('install deps')
    task.start()

    task.onUpdate(($task) => {
      assert.equal($task.getState(), 'succeeded')
      done()
    })

    task.markAsSucceeded()
  }).waitForDone()

  test('mark test as completed with summary', ({ assert }, done) => {
    assert.plan(2)

    const task = new Task('install deps')
    task.start()

    task.onUpdate(($task) => {
      assert.equal($task.getState(), 'succeeded')
      assert.equal($task.getSuccessMessage(), 'All good')
      done()
    })

    task.markAsSucceeded('All good')
  }).waitForDone()

  test('mark test as failed', ({ assert }, done) => {
    assert.plan(2)

    const task = new Task('install deps')
    task.start()

    task.onUpdate(($task) => {
      assert.equal($task.getState(), 'failed')
      assert.equal($task.getError(), 'Something went wrong')
      done()
    })

    task.markAsFailed('Something went wrong')
  }).waitForDone()

  test('pass error instance as task failure message', ({ assert }, done) => {
    assert.plan(2)

    const task = new Task('install deps')
    task.start()

    task.onUpdate(($task) => {
      assert.equal($task.getState(), 'failed')
      assert.equal(($task.getError() as Error).message, 'Something went wrong')
      done()
    })

    task.markAsFailed(new Error('Something went wrong'))
  }).waitForDone()
})
