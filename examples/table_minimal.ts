import { cliui } from '../index.js'

const ui = cliui()
const table = ui.table({ minimal: true })

console.log('')

table
  .head([
    ui.colors.cyan('Package'),
    ui.colors.cyan('Version'),
    { content: ui.colors.cyan('Status'), hAlign: 'right' },
  ])
  .fullWidth()
  .fluidColumnIndex(0)
  .row([
    '@poppinss/cliui',
    ui.colors.italic('6.8.1'),
    { content: ui.colors.green('Ready'), hAlign: 'right' },
  ])
  .row([
    '@poppinss/prompts',
    ui.colors.italic('3.0.0'),
    { content: ui.colors.yellow('Pending'), hAlign: 'right' },
  ])
  .render()
