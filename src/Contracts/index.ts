/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface RendererContract {
	log(message: string): void
	logError(message: string): void
}

export type LoggerOptions = {
	colors: boolean
	iconColors: boolean
	icons: boolean
	dim: boolean
	dimIcons: boolean
}

export type ActionOptions = {
	colors: boolean
	dim: boolean
}

export type LoggingTypes = 'success' | 'error' | 'fatal' | 'warning' | 'info' | 'debug'
