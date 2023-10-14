import { cliui } from '../index.js'
const ui = cliui()
const sticker = ui.sticker()

console.log('')

sticker
  .fullScreen()
  .drawBorder((borderChar, colors) => colors.cyan(borderChar))
  .add('Started HTTP server')
  .add('')
  .add(`Local address:    ${ui.colors.cyan('http://localhost:3333')}`)
  .add(`Network address:  ${ui.colors.cyan('http://192.168.1.2:3333')}`)
  .render()
