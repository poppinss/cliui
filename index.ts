/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import colorSupport from 'color-support'

import { Table } from './src/Table'
import { Logger } from './src/Logger'
import { TaskManager } from './src/Task/Manager'
import { Instructions } from './src/Instructions'
import { MemoryRenderer } from './src/Renderer/Memory'
import { ConsoleRenderer } from './src/Renderer/Console'

/**
 * Is terminal interactive or not. The code is copied from
 * https://github.com/sindresorhus/is-interactive/blob/master/index.js.
 *
 * Yes, we can install it as a dependency, but decided to copy/paste 4
 * lines. NO STRONG REASONS BEHIND IT
 */
const interactive = Boolean(
	process.stdout && process.stdout.isTTY && process.env.TERM !== 'dumb' && !('CI' in process.env)
)

/**
 * Whether or not colors are enabled. They are enabled by default,
 * unless the terminal doesn't support color. Also "FORCE_COLOR"
 * env variable enables them forcefully.
 */
const colors = !!process.env.FORCE_COLOR || colorSupport.level > 0

/**
 * A boolean to know, if we are in testing mode or not. During tests
 * we will use the memory renderer.
 */
const testing = !!process.env.CLI_UI_IS_TESTING

/**
 * The renderer used in the testing mode. One can access it to listen
 * for the log messages. Also, the memory renderer only works when
 * the "CLI_UI_IS_TESTING" flag is set
 */
export const testingRenderer = new MemoryRenderer()

/**
 * Console renderer outputs to the console. We do not export it, since one
 * cannot do much by having an access to it.
 */
const consoleRenderer = new ConsoleRenderer()

/**
 * Logger
 */
export const logger = new Logger({ colors, interactive }, testing)
logger.useRenderer(testing ? testingRenderer : consoleRenderer)

/**
 * Reference to the instructions block to render a set of lines inside
 * a box.
 */
export const instructions = () => new Instructions({ colors, icons: true }, testing)

/**
 * Similar to instructions. But the lines are not prefix with a pointer `>`
 */
export const sticker = () => new Instructions({ colors, icons: false }, testing)

/**
 * Initiates a group of tasks
 */
export const tasks = () => new TaskManager({ colors, interactive }, testing)

/**
 * Initiate tasks in verbose mode
 */
tasks.verbose = () => new TaskManager({ colors, interactive, verbose: true }, testing)

/**
 * Instantiate a new table
 */
export const table = () => new Table({ colors }, testing)
