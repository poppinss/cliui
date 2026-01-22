/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { cliui } from '../index.js'

test.group('Steps', () => {
  test('render steps with titles and content', ({ assert }) => {
    const ui = cliui({ mode: 'raw' })
    const steps = ui.steps()

    steps.add('Install dependencies', 'Run npm install to get started')
    steps.add('Configure app', 'Create a .env file with your settings')
    steps.add('Start server', 'Use npm start to launch the application')
    steps.render()

    const logs = steps.getRenderer().getLogs()
    assert.lengthOf(logs, 1)
    assert.equal(logs[0].stream, 'stdout')
    assert.include(logs[0].message, 'cyan(1.)')
    assert.include(logs[0].message, 'bold(Install dependencies)')
    assert.include(logs[0].message, 'Run npm install to get started')
    assert.include(logs[0].message, 'cyan(2.)')
    assert.include(logs[0].message, 'bold(Configure app)')
    assert.include(logs[0].message, 'cyan(3.)')
    assert.include(logs[0].message, 'bold(Start server)')
  })

  test('render steps with titles only', ({ assert }) => {
    const ui = cliui({ mode: 'raw' })
    const steps = ui.steps()

    steps.add('Download files')
    steps.add('Extract archive')
    steps.add('Verify checksums')
    steps.render()

    const logs = steps.getRenderer().getLogs()
    assert.lengthOf(logs, 1)
    assert.include(logs[0].message, 'cyan(1.)')
    assert.include(logs[0].message, 'bold(Download files)')
    assert.include(logs[0].message, 'cyan(2.)')
    assert.include(logs[0].message, 'bold(Extract archive)')
    assert.include(logs[0].message, 'cyan(3.)')
    assert.include(logs[0].message, 'bold(Verify checksums)')
  })

  test('render steps with multiline content', ({ assert }) => {
    const ui = cliui({ mode: 'raw' })
    const steps = ui.steps()

    steps.add('Configure environment', 'Copy .env.example to .env\nUpdate API keys and credentials')
    steps.render()

    const logs = steps.getRenderer().getLogs()
    assert.lengthOf(logs, 1)
    assert.include(logs[0].message, 'Copy .env.example to .env')
    assert.include(logs[0].message, 'Update API keys and credentials')
  })

  test('support method chaining', ({ assert }) => {
    const ui = cliui({ mode: 'raw' })
    const steps = ui.steps()

    steps
      .add('Step 1', 'First step')
      .add('Step 2', 'Second step')
      .add('Step 3', 'Third step')
      .render()

    const logs = steps.getRenderer().getLogs()
    assert.lengthOf(logs, 1)
    assert.include(logs[0].message, 'bold(Step 1)')
    assert.include(logs[0].message, 'bold(Step 2)')
    assert.include(logs[0].message, 'bold(Step 3)')
  })

  test('prepare without rendering', ({ assert }) => {
    const ui = cliui({ mode: 'raw' })
    const steps = ui.steps()

    steps.add('Install', 'Run npm install')
    steps.add('Build', 'Run npm build')

    const output = steps.prepare()
    const logs = steps.getRenderer().getLogs()

    assert.lengthOf(logs, 0) // Should not log anything
    assert.include(output, 'cyan(1.)')
    assert.include(output, 'bold(Install)')
    assert.include(output, 'Run npm install')
    assert.include(output, 'cyan(2.)')
    assert.include(output, 'bold(Build)')
  })

  test('raw mode omits borders and indentation', ({ assert }) => {
    const ui = cliui({ mode: 'raw' })
    const steps = ui.steps()

    steps.add('Step 1', 'Content 1')
    steps.add('Step 2', 'Content 2')
    const output = steps.prepare()

    // In raw mode, should not have border characters or extra indentation
    assert.notInclude(output, 'dim(│)')
    assert.notInclude(output, 'dim(|)')

    // Content should be on its own line without indentation
    assert.include(output, 'Content 1')
    assert.include(output, 'Content 2')
  })
})
