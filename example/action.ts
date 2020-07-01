import { logger } from '../index'

console.log(logger.colors.dim('-----------------------------------------------'))
console.log(logger.colors.yellow(' 	           ACTIONS 				   '))
console.log(logger.colors.dim('-----------------------------------------------'))
console.log()

logger.action('create').succeeded('config/auth.ts')
logger.action('update').succeeded('.tsconfig.json')
logger.action('create').skipped('app/Models/User.ts')
logger.action('create').failed('server.ts', 'File already exists')
