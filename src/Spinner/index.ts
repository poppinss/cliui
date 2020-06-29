/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import logUpdate from 'log-update'

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
	private state: 'idle' | 'started' | 'stopped' = 'idle'

	/**
	 * The current index for the frames
	 */
	private currentIndex = 0

	constructor(private text: string, private testing: boolean = false) {}

	/**
	 * Increment index. Handles index overflow
	 */
	private incrementIndex() {
		this.currentIndex = this.frames.length === this.currentIndex + 1 ? 0 : this.currentIndex + 1
	}

	/**
	 * Loop over the message and animate the spinner
	 */
	private loop() {
		if (this.state !== 'started') {
			return
		}

		const frame = this.frames[this.currentIndex]
		logUpdate(`${this.text} ${frame}`)

		setTimeout(() => {
			this.incrementIndex()
			this.loop()
		}, this.interval)
	}

	/**
	 * Update the text and persist right away
	 */
	private updateAndPersist (frameIndex: number) {
		/**
		 * Print the message as it is in testing mode
		 */
		if (this.testing) {
			logUpdate(`${this.text} ${this.frames[frameIndex]}`)
			logUpdate.done()
			return
		}
	}

	/**
	 * Star the spinner
	 */
	public start() {
		this.state = 'started'

		/**
		 * Print the message as it is in testing mode
		 */
		if (this.testing) {
			this.updateAndPersist(2)
			return
		}

		this.loop()
	}

	/**
	 * Update spinner
	 */
	public update(text: string) {
		this.text = text

		/**
		 * Print the message as it is in testing mode
		 */
		if (this.testing) {
			this.updateAndPersist(2)
			return
		}

		return this
	}

	/**
	 * Stop spinner
	 */
	public stop() {
		this.state = 'stopped'
		this.currentIndex = 0

		if (!this.testing) {
			logUpdate.done()
		}
	}
}
