/*
 * @poppinss/clui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Colors } from '@poppinss/colors'

import { icons } from '../Icons'
import { getBest } from '../Colors'
import { Spinner } from '../Spinner'
import { ConsoleRenderer } from '../Renderer/Console'
import { LoggerOptions, RendererContract, LoggingTypes } from '../Contracts'

/**
 * Default config options
 */
const DEFAULTS: LoggerOptions = {
	icons: true,
	dim: false,
	dimIcons: false,
	colors: true,
	iconColors: true,
}

/**
 * Logger exposes the API to log messages with consistent styles
 * and colors
 */
export class Logger {
	public options: LoggerOptions
	private colors: ReturnType<typeof getBest>
	private iconColors: ReturnType<typeof getBest>
	private renderer?: RendererContract

	constructor(options?: Partial<LoggerOptions>, private testing: boolean = false) {
		this.options = { ...DEFAULTS, ...options }
		this.colors = getBest(this.testing, this.options.colors)
		this.iconColors = getBest(this.testing, this.options.iconColors && this.options.colors)
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
	 * Colors the icon
	 */
	private colorizeIcon(color: keyof Colors, figure: string): string {
		if (this.options.dim || this.options.dimIcons) {
			return this.iconColors.dim()[color](figure) as string
		}

		return this.iconColors[color](figure) as string
	}

	/**
	 * Returns the icon for a given logging type
	 */
	private getIcon(type: LoggingTypes): string {
		switch (type) {
			case 'success':
				return this.colorizeIcon('green', icons.tick)
			case 'error':
			case 'fatal':
				return this.colorizeIcon('red', icons.cross)
			case 'warning':
				return this.colorizeIcon('yellow', icons.warning)
			case 'info':
				return this.colorizeIcon('blue', icons.info)
			case 'debug':
				return this.colorizeIcon('cyan', icons.bullet)
			case 'await':
				return this.colorizeIcon('yellow', icons.squareSmallFilled)
		}
	}

	/**
	 * Appends the suffix to the message
	 */
	private addSuffix(message: string, suffix?: string): string {
		if (!suffix) {
			return message
		}
		return `${message} ${this.colors.dim().yellow(`(${suffix})`)}`
	}

	/**
	 * Prepends the prefix to the message. We do not DIM the prefix, since
	 * gray doesn't have much brightness already
	 */
	private addPrefix(message: string, prefix?: string): string {
		if (!prefix) {
			return message
		}

		prefix = prefix.replace(/%time%/, new Date().toISOString())
		return `${this.colors.gray(`[${prefix}]`)} ${message}`
	}

	/**
	 * Prepends the prefix to the message
	 */
	private prefixIcon(message: string, icon: string) {
		if (!this.options.icons) {
			return message
		}

		return `${icon}  ${message}`
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
	 * Decorate message string
	 */
	private formatStack(stack?: string): string {
		if (!stack) {
			return ''
		}

		return `\n${stack
			.split('\n')
			.splice(1)
			.map((line) => {
				return `${this.colors.dim(line)}`
			})
			.join('\n')}`
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
	 * Log success message
	 */
	public success(message: string, prefix?: string, suffix?: string) {
		message = this.decorateMessage(message)
		message = this.prefixIcon(message, this.getIcon('success'))
		message = this.addPrefix(message, prefix)
		message = this.addSuffix(message, suffix)

		this.getRenderer().log(message)
	}

	/**
	 * Log error message
	 */
	public error(message: string | { message: string }, prefix?: string, suffix?: string) {
		message = typeof message === 'string' ? message : message.message
		message = this.decorateMessage(message)
		message = this.prefixIcon(message, this.getIcon('error'))
		message = this.addPrefix(message, prefix)
		message = this.addSuffix(message, suffix)

		this.getRenderer().logError(message)
	}

	/**
	 * Log fatal message
	 */
	public fatal(message: string | { message: string; stack?: string }, prefix?: string, suffix?: string) {
		const stack = this.formatStack(typeof message === 'string' ? undefined : message.stack)

		message = typeof message === 'string' ? message : message.message
		message = this.decorateMessage(message)
		message = this.prefixIcon(message, this.getIcon('error'))
		message = this.addPrefix(message, prefix)
		message = this.addSuffix(message, suffix)

		this.getRenderer().logError(`${message}${stack}`)
	}

	/**
	 * Log warning message
	 */
	public warning(message: string, prefix?: string, suffix?: string) {
		message = this.decorateMessage(message)
		message = this.prefixIcon(message, this.getIcon('warning'))
		message = this.addPrefix(message, prefix)
		message = this.addSuffix(message, suffix)

		this.getRenderer().log(message)
	}

	/**
	 * Log info message
	 */
	public info(message: string, prefix?: string, suffix?: string) {
		message = this.decorateMessage(message)
		message = this.prefixIcon(message, this.getIcon('info'))
		message = this.addPrefix(message, prefix)
		message = this.addSuffix(message, suffix)

		this.getRenderer().log(message)
	}

	/**
	 * Log debug message
	 */
	public debug(message: string, prefix?: string, suffix?: string) {
		message = this.decorateMessage(message)
		message = this.prefixIcon(message, this.getIcon('debug'))
		message = this.addPrefix(message, prefix)
		message = this.addSuffix(message, suffix)

		this.getRenderer().log(message)
	}

	/**
	 * Log a message with a spinner
	 */
	public await(message: string, prefix?: string, suffix?: string) {
		message = this.decorateMessage(message)
		message = this.prefixIcon(message, this.getIcon('await'))
		message = this.addPrefix(message, prefix)
		message = this.addSuffix(message, suffix)
		return new Spinner(message, this.testing).start()
	}
}
