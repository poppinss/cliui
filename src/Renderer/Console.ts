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
 * Renders messages to the "stdout" and "stderr"
 */
export class ConsoleRenderer implements RendererContract {
	public log(message: string) {
		console.log(message)
	}

	public logError(message: string) {
		console.error(message)
	}
}
