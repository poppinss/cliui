import { sticker, logger } from '../index'

sticker()
  .add('Started HTTP server')
  .add('')
  .add(`Local address:    ${logger.colors.cyan('http://localhost:3333')}`)
  .add(`Network address:  ${logger.colors.cyan('http://localhost:3333')}`)
  .render()
