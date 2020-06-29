/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Shape of the renderer contract. Except the spinner, every
 * interface accepts a renderer
 */
export interface RendererContract {
	log(message: string): void
	logError(message: string): void
}

/**
 * Logging types
 */
export type LoggingTypes = 'success' | 'error' | 'fatal' | 'warning' | 'info' | 'debug' | 'await'

/**
 * Options accepted by the logger
 */
export type LoggerOptions = {
	colors: boolean
	iconColors: boolean
	icons: boolean
	dim: boolean
	dimIcons: boolean
}

/**
 * Options accepted by an action
 */
export type ActionOptions = LoggerOptions

/**
 * Options accepted by instructions
 */
export type InstructionsOptions = {
	icons: boolean
	colors: boolean
}

/**
 * Shape of the instructions line
 */
export type InstructionsLine = {
	text: string
	width: number
}
