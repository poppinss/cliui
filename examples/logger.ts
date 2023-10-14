import { cliui } from '../index.js'
const ui = cliui()
const logger = ui.logger

console.log('')

logger.info('This is an info message')
logger.info('Message with time prefix', { prefix: '%time%' })
logger.warning('Running out of disk space')
logger.error(new Error('Unable to write. Disk full'))
logger.fatal(new Error('Unable to write. Disk full'))
logger.debug('Something just happened')
logger.success('Account created')

const spinner = logger.await('installing dependencies', { suffix: 'npm install --production' })
spinner.start()
setTimeout(() => {
  spinner.stop()
}, 2000)
