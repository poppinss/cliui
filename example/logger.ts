import { logger } from '../index'

console.log(logger.colors.dim('-----------------------------------------------'))
console.log(logger.colors.yellow(' 	           LOGGER 				   '))
console.log(logger.colors.dim('-----------------------------------------------'))

logger.info('This is an info message')
logger.warning('Running out of disk space')
logger.error(new Error('Unable to write. Disk full'))
logger.fatal(new Error('Unable to write. Disk full'))
logger.debug('Something just happened')
logger.success('Account created')
logger.info('Message with time prefix', '%time%')
logger.await('installing dependencies', undefined, 'npm install --production')
