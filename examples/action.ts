import { cliui } from '../index.js'
const ui = cliui()
const logger = ui.logger

console.log()

logger.action('Creating config/auth.ts').displayDuration().succeeded()
logger.action('Updating .tsconfig.json').succeeded()
logger.action('Creating app/Models/User.ts').skipped('File already exists')
logger.action('Creating server.ts').failed('File already exists')
logger.action('Creating server.ts').failed(new Error('File already exists'))
