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
export const isInteractive = Boolean(
	process.stdout && process.stdout.isTTY && process.env.TERM !== 'dumb' && !('CI' in process.env)
)

/**
 * Whether or not colors are enabled. They are enabled by default,
 * unless the terminal doesn't support color. Also "FORCE_COLOR"
 * env variable enables them forcefully.
 */
export const supportsColors = !!process.env.FORCE_COLOR || colorSupport.level > 0

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
export const logger = new Logger({ colors: supportsColors, interactive: isInteractive }, testing)
logger.useRenderer(testing ? testingRenderer : consoleRenderer)

/**
 * Reference to the instructions block to render a set of lines inside
 * a box.
 */
export const instructions = () => {
	const instructionsInstance = new Instructions({ colors: supportsColors, icons: true }, testing)
	instructionsInstance.useRenderer(testing ? testingRenderer : consoleRenderer)
	return instructionsInstance
}

/**
 * Similar to instructions. But the lines are not prefix with a pointer `>`
 */
export const sticker = () => {
	const stickerInstance = new Instructions({ colors: supportsColors, icons: false }, testing)
	stickerInstance.useRenderer(testing ? testingRenderer : consoleRenderer)
	return stickerInstance
}

/**
 * Initiates a group of tasks
 */
export const tasks = () => {
	const manager = new TaskManager({ colors: supportsColors, interactive: isInteractive }, testing)
	manager.useRenderer(testing ? testingRenderer : consoleRenderer)
	return manager
}

/**
 * Initiate tasks in verbose mode
 */
tasks.verbose = () => {
	const manager = new TaskManager(
		{ colors: supportsColors, interactive: isInteractive, verbose: true },
		testing
	)
	manager.useRenderer(testing ? testingRenderer : consoleRenderer)
	return manager
}

/**
 * Instantiate a new table
 */
export const table = () => {
	const tableInstance = new Table({ colors: supportsColors }, testing)
	tableInstance.useRenderer(testing ? testingRenderer : consoleRenderer)
	return tableInstance
}
