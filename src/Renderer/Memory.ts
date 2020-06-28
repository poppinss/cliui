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

	public log(message: string) {
		this.logs.push({ message, stream: 'stdout' })
	}

	public logError(message: string) {
		this.logs.push({ message, stream: 'stderr' })
	}
}
