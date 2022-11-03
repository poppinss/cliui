import cliui from '../index.js'
const ui = cliui()
const logger = ui.logger

console.log()

logger.action('create').succeeded('config/auth.ts')
logger.action('update').succeeded('.tsconfig.json')
logger.action('create').skipped('app/Models/User.ts', 'File already exists')
logger.action('create').failed('server.ts', 'File already exists')
logger.action('create').failed('server.ts', new Error('File already exists'))
