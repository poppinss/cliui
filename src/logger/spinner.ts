/*
 * @poppinss/utils
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ConsoleRenderer } from '../renderers/console.js'
import type { LoggerMessageOptions, RendererContract, SpinnerMessage } from '../types.js'

/**
 * Textual spinner to print a message with dotted progress
 * bar.
 */
export class Spinner {
  #animator = {
    frames: ['.  ', '.. ', '...', ' ..', '  .', '   '],
    interval: 200,
    index: 0,
    getFrame() {
      return this.frames[this.index]
    },
    advance() {
      this.index = this.index + 1 === this.frames.length ? 0 : this.index + 1
      return this.index
    },
  }

  /**
   * The state of the spinner
   */
  #state: 'idle' | 'running' | 'stopped' = 'idle'

  /**
   * Spinner message
   */
  #message: SpinnerMessage

  /**
   * The renderer to use for writing to the console
   */
  #renderer?: RendererContract

  /**
   * Custom method to handle animation result
   */
  #spinnerWriter?: (line: string) => void

  constructor(message: SpinnerMessage) {
    this.#message = message
  }

  /**
   * Loop over the message and animate the spinner
   */
  #animate() {
    if (this.#state !== 'running') {
      return
    }

    /**
     * Do not write when in silent mode
     */
    if (this.#message.silent) {
      return
    }

    const frame = this.#animator.getFrame()

    if (this.#spinnerWriter) {
      this.#spinnerWriter(`${this.#message.render()} ${frame}`)
    } else {
      this.getRenderer().logUpdate(`${this.#message.render()} ${frame}`)
    }

    setTimeout(() => {
      this.#animator.advance()
      this.#animate()
    }, this.#animator.interval)
  }

  /**
   * Returns the renderer for rendering the messages
   */
  getRenderer(): RendererContract {
    if (!this.#renderer) {
      this.#renderer = new ConsoleRenderer()
    }

    return this.#renderer
  }

  /**
   * Define the custom renderer
   */
  useRenderer(renderer: RendererContract): this {
    this.#renderer = renderer
    return this
  }

  /**
   * Star the spinner
   */
  start(): this {
    this.#state = 'running'
    this.#animate()
    return this
  }

  /**
   * Update spinner
   */
  update(text: string, options?: LoggerMessageOptions): this {
    if (this.#state !== 'running') {
      return this
    }

    Object.assign(this.#message, { text, ...options })
    return this
  }

  /**
   * Stop spinner
   */
  stop() {
    this.#state = 'stopped'
    this.#animator.index = 0

    if (!this.#spinnerWriter && !this.#message.silent) {
      this.getRenderer().logUpdate(`${this.#message.render()} ${this.#animator.frames[2]}`)
      this.getRenderer().logUpdatePersist()
    }
  }

  /**
   * Tap into spinner to manually write the
   * output.
   */
  tap(callback: (line: string) => void): this {
    this.#spinnerWriter = callback
    return this
  }
}
