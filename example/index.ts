import { Logger } from '../src/Logger'
import { Action } from '../src/Action'
import { getBest } from '../src/Colors'
import { Instructions } from '../src/Instructions'

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

// console.log('-------------------------------')
// console.log('SPINNER')
// console.log('-------------------------------')
// logger.await('installing packages', undefined, 'npm install')

console.log('-------------------------------')
console.log('INSTRUCTIONS')
console.log('-------------------------------')
const instructions = new Instructions()
instructions.add(`cd ${getBest(false, true).cyan('app')}`)
instructions.add(`Run ${getBest(false, true).cyan('node ace serve --dev')}`)
instructions.render()

console.log('-------------------------------')
console.log('INSTRUCTIONS')
console.log('-------------------------------')
const serverRunning = new Instructions({ icons: false })
serverRunning.add(`Site running at:`)
serverRunning.add(`- Local:                 ${getBest(false, true).cyan('http://localhost:8080/')}`)
serverRunning.add(`- Network:               ${getBest(false, true).cyan('http://192.168.1.4:8080/')}`)
serverRunning.render()
