/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Logger } from '../index'

/**
 * The most simplest spinner to log message with a progress indicator
 */
export class Spinner {
	/**
	 * Frames to loop over
	 */
	private frames = ['.  ', '.. ', '...', ' ..', '  .', '   ']

	/**
	 * Animation duration
	 */
	private interval = 200

	/**
	 * The state of the spinner
	 */
	private state: 'idle' | 'running' | 'stopped' = 'idle'

	/**
	 * The current index for the frames
	 */
	private currentIndex = 0

	/**
	 * Builds the message to the print from the text
	 */
	private messageBuilder: {
		suffix?: string
		prefix?: string
		render: (text: string) => string
	} = {
		render(text: string) {
			if (this.prefix) {
				text = `[${this.prefix}] ${text}`
			}

			if (this.suffix) {
				text = `${text} ${this.suffix}`
			}

			return text
		},
	}

	constructor(private text: string, private logger: Logger, private testing: boolean = false) {}

	/**
	 * Increment index. Also, handles the index overflow
	 */
	private incrementIndex() {
		this.currentIndex = this.frames.length === this.currentIndex + 1 ? 0 : this.currentIndex + 1
	}

	/**
	 * Loop over the message and animate the spinner
	 */
	private loop() {
		if (this.state !== 'running') {
			return
		}

		/**
		 * Print the message as it is in testing mode or when the TTY is
		 * not interactive
		 */
		if (this.testing || !this.logger.options.interactive) {
			this.logger.logUpdate(`${this.messageBuilder.render(this.text)} ${this.frames[2]}`)
			return
		}

		/**
		 * Otherwise log the current frame and re-run the function
		 * with some delay
		 */
		const frame = this.frames[this.currentIndex]
		this.logger.logUpdate(`${this.messageBuilder.render(this.text)} ${frame}`)

		setTimeout(() => {
			this.incrementIndex()
			this.loop()
		}, this.interval)
	}

	/**
	 * Star the spinner
	 */
	public start(): this {
		this.state = 'running'
		this.loop()
		return this
	}

	/**
	 * Define a custom message builder
	 */
	public useMessageBuilder(messageBuilder: { render: (text: string) => string }): this {
		this.messageBuilder = messageBuilder
		return this
	}

	/**
	 * Update spinner
	 */
	public update(text: string, prefix?: string, suffix?: string): this {
		if (this.state !== 'running') {
			return this
		}

		this.text = text

		if (prefix !== undefined) {
			this.messageBuilder.prefix = prefix
		}

		if (suffix !== undefined) {
			this.messageBuilder.suffix = suffix
		}

		/**
		 * Print the message as it is in testing mode or when the TTY is
		 * not interactive
		 */
		if (this.testing || !this.logger.options.interactive) {
			this.logger.logUpdate(`${this.messageBuilder.render(this.text)} ${this.frames[2]}`)
			return this
		}

		return this
	}

	/**
	 * Stop spinner
	 */
	public stop() {
		this.state = 'stopped'
		this.currentIndex = 0
		this.logger.logUpdatePersist()
	}
}
