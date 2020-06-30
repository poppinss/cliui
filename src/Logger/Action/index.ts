/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Colors } from '@poppinss/colors'

import { Logger } from '../index'
import { RendererContract } from '../../Contracts'

/**
 * Exposes the API to print actions in one of the following three states
 *
 * - failed
 * - succeeded
 * - skipped
 */
export class Action {
	constructor(private label: string, private logger: Logger) {}

	/**
	 * Returns the label
	 */
	private getLabel(label: string, color: keyof Colors) {
		if (!this.logger.options.colors) {
			return `[${label}]`
		}

		return this.logger.colors.underline()[color](label) as string
	}

	/**
	 * Define a custom renderer. Logs to "stdout" and "stderr"
	 * by default
	 */
	public useRenderer(renderer: RendererContract): this {
		this.logger.useRenderer(renderer)
		return this
	}

	/**
	 * Mark action as successful
	 */
	public succeeded(message: string) {
		const label = this.getLabel(this.label, 'green')
		this.logger.success(`${label} ${message}`)
	}

	/**
	 * Mark action as skipped
	 */
	public skipped(message: string) {
		const label = this.getLabel('skip', 'cyan')
		this.logger.debug(`${label} ${message}`)
	}

	/**
	 * Mark action as failed
	 */
	public failed(message: string) {
		const label = this.getLabel(this.label, 'red')
		this.logger.error(`${label} ${message}`)
	}
}
