import { Logger } from '../src/Logger'
import { Action } from '../src/Action'

console.log('-------------------------------')
console.log('ACTIONS')
console.log('-------------------------------')

const action = new Action('create')
action.succeeded('config/app.ts')
action.failed('app/Controllers/User.ts')
action.skipped('app/Models/User.ts')

console.log('-------------------------------')
console.log('LOG MESSAGES')
console.log('-------------------------------')

const logger = new Logger()
logger.info('hello world')
logger.success('all went fine')
logger.error(new Error('Failure...'))
logger.fatal(new Error('Failure...'))
logger.warning('fire in the hole')
logger.info('for your info')
logger.debug('trying to do it')

console.log('-------------------------------')
console.log('PREFIX TIME')
console.log('-------------------------------')
logger.success('trying to do it', '%time%')

console.log('-------------------------------')
console.log('SUFFIX')
console.log('-------------------------------')
logger.debug('installing packages', undefined, 'npm install')

console.log('-------------------------------')
console.log('SPINNER')
console.log('-------------------------------')
logger.await('installing packages', undefined, 'npm install')
