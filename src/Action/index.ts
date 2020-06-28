/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Colors } from '@poppinss/colors'

import { getBest } from '../Colors'
import { ConsoleRenderer } from '../Renderer/Console'
import { ActionOptions, RendererContract } from '../Contracts'

/**
 * Default config options
 */
const DEFAULTS: ActionOptions = {
	dim: false,
	colors: true,
}

/**
 * Exposes the API to print actions in one of the following three states
 *
 * - failed
 * - succeeded
 * - skipped
 */
export class Action {
	private options: ActionOptions
	private colors: ReturnType<typeof getBest>
	private renderer?: RendererContract

	constructor(options?: Partial<ActionOptions>, private testing: boolean = false) {
		this.options = { ...DEFAULTS, ...options }
		this.options.colors = this.shouldEnableColors(this.options.colors)
		this.colors = getBest(this.testing, this.options.colors)
	}

	/**
	 * Returns a boolean telling if we should enable or disable the
	 * colors. We override the user defined "true" value if the
	 * user terminal doesn't support colors
	 */
	private shouldEnableColors(userDefined: boolean) {
		if (userDefined === true) {
			return require('color-support').level > 0
		}

		return false
	}

	/**
	 * Decorate message string
	 */
	private decorateMessage(message: string): string {
		if (this.options.dim) {
			return this.colors.dim(message) as string
		}
		return message
	}

	/**
	 * Returns the label
	 */
	private getLabel(label: string, color: keyof Colors) {
		if (!this.options.colors) {
			return `[${label}]`
		}

		if (this.options.dim) {
			return this.colors.dim().underline()[color](label) as string
		}
		return this.colors.underline()[color](label) as string
	}

	/**
	 * Returns the renderer for rendering the messages
	 */
	private getRenderer() {
		if (!this.renderer) {
			this.renderer = new ConsoleRenderer()
		}
		return this.renderer
	}

	/**
	 * Define a custom renderer. Logs to "stdout" and "stderr"
	 * by default
	 */
	public useRenderer(renderer: RendererContract): this {
		this.renderer = renderer
		return this
	}

	/**
	 * Mark action as successful
	 */
	public succeeded(message: string) {
		message = this.decorateMessage(message)
		const label = this.getLabel('success', 'green')
		this.getRenderer().log(`${label}  ${message}`)
	}

	/**
	 * Mark action as skipped
	 */
	public skipped(message: string) {
		message = this.decorateMessage(message)
		const label = this.getLabel('skip', 'magenta')
		this.getRenderer().log(`${label}     ${message}`)
	}

	/**
	 * Mark action as failed
	 */
	public failed(message: string) {
		message = this.decorateMessage(message)
		const label = this.getLabel('error', 'red')
		this.getRenderer().logError(`${label}    ${message}`)
	}
}
