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
import { Steps } from '../src/steps.js'
import { useColors } from '../src/colors.js'

test.group('Steps', () => {
  test('connect steps and their content using the Clack rail', ({ assert }) => {
    const steps = new Steps()
    steps.useColors(useColors({ raw: true }))

    steps.add('Install dependencies', 'Run npm install')
    steps.add('Start server', 'Run npm start')

    assert.equal(
      steps.prepare(),
      [
        'green(◇)  1. Install dependencies',
        'gray(│)  Run npm install',
        'gray(│)',
        'green(◇)  2. Start server',
        'gray(│)  Run npm start',
      ].join('\n')
    )
  })

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
    assert.include(logs[0].message, 'green(◇)  1. Install dependencies')
    assert.include(logs[0].message, 'Run npm install to get started')
    assert.include(logs[0].message, 'green(◇)  2. Configure app')
    assert.include(logs[0].message, 'green(◇)  3. Start server')
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
    assert.include(logs[0].message, 'green(◇)  1. Download files')
    assert.include(logs[0].message, 'green(◇)  2. Extract archive')
    assert.include(logs[0].message, 'green(◇)  3. Verify checksums')
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
    assert.include(logs[0].message, 'green(◇)  1. Step 1')
    assert.include(logs[0].message, 'green(◇)  2. Step 2')
    assert.include(logs[0].message, 'green(◇)  3. Step 3')
  })

  test('prepare without rendering', ({ assert }) => {
    const ui = cliui({ mode: 'raw' })
    const steps = ui.steps()

    steps.add('Install', 'Run npm install')
    steps.add('Build', 'Run npm build')

    const output = steps.prepare()
    const logs = steps.getRenderer().getLogs()

    assert.lengthOf(logs, 0) // Should not log anything
    assert.include(output, 'green(◇)  1. Install')
    assert.include(output, 'Run npm install')
    assert.include(output, 'green(◇)  2. Build')
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
