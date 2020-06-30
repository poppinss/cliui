/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RendererContract } from '../Contracts'

/**
 * Keeps log messages within memory. Useful for testing
 */
export class MemoryRenderer implements RendererContract {
	public logs: { message: string; stream: 'stdout' | 'stderr' }[] = []

	/**
	 * Log message
	 */
	public log(message: string) {
		this.logs.push({ message, stream: 'stdout' })
	}

	/**
	 * For memory renderer the logUpdate is similar to log
	 */
	public logUpdate(message: string) {
		this.log(message)
	}

	/**
	 * Its a noop
	 */
	public logUpdateDone() {}

	/**
	 * Log message as error
	 */
	public logError(message: string) {
		this.logs.push({ message, stream: 'stderr' })
	}
}
