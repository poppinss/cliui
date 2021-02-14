/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { instantiate } from './api'
const ui = instantiate(!!process.env.CLI_UI_IS_TESTING)

/**
 * Is terminal interactive or not. The code is copied from
 * https://github.com/sindresorhus/is-interactive/blob/master/index.js.
 *
 * Yes, we can install it as a dependency, but decided to copy/paste 4
 * lines. NO STRONG REASONS BEHIND IT
 */
export const isInteractive = ui.isInteractive

/**
 * Whether or not colors are enabled. They are enabled by default,
 * unless the terminal doesn't support color. Also "FORCE_COLOR"
 * env variable enables them forcefully.
 */
export const supportsColors = ui.supportsColors

/**
 * The renderer used in the testing mode. One can access it to listen
 * for the log messages. Also, the memory renderer only works when
 * the "CLI_UI_IS_TESTING" flag is set
 */
export const testingRenderer = ui.testingRenderer

/**
 * Console renderer outputs to the console. We do not export it, since one
 * cannot do much by having an access to it.
 */
export const consoleRenderer = ui.consoleRenderer

/**
 * Logger
 */
export const logger = ui.logger

/**
 * Icons
 */
export const icons = ui.icons

/**
 * Reference to the instructions block to render a set of lines inside
 * a box.
 */
export const instructions = ui.instructions

/**
 * Similar to instructions. But the lines are not prefix with a pointer `>`
 */
export const sticker = ui.sticker

/**
 * Initiates a group of tasks
 */
export const tasks = ui.tasks

/**
 * Instantiate a new table
 */
export const table = ui.table
