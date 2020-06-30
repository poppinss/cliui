/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import logUpdate from 'log-update'
import { RendererContract } from '../Contracts'

/**
 * Renders messages to the "stdout" and "stderr"
 */
export class ConsoleRenderer implements RendererContract {
	public log(message: string) {
		console.log(message)
	}

	/**
	 * Log message by overwriting the existing one
	 */
	public logUpdate(message: string) {
		logUpdate(message)
	}

	/**
	 * Persist the last logged message
	 */
	public logUpdateDone() {
		logUpdate.done()
	}

	/**
	 * Log error
	 */
	public logError(message: string) {
		console.error(message)
	}
}
