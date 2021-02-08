import { instructions, logger } from '../index'

instructions()
  .add(`cd ${logger.colors.cyan('hello-world')}`)
  .add(`Run ${logger.colors.cyan('node ace serve --watch')} to start the server`)
  .render()
