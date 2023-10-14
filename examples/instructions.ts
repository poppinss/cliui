import { cliui } from '../index.js'
const ui = cliui()
const instructions = ui.instructions()

console.log('')

instructions
  .add(`cd ${ui.colors.cyan('hello-world')}`)
  .add(`Run ${ui.colors.cyan('node ace serve --watch')} to start the server`)
  .render()
