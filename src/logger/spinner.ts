/*
 * @poppinss/utils
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Colors } from '@poppinss/colors/types'
import { S_STEP_SUBMIT, unicodeOr } from '@clack/prompts'

import { useColors } from '../colors.js'
import { ConsoleRenderer } from '../renderers/console.js'
import type { LoggerMessageOptions, RendererContract, SpinnerMessage } from '../types.js'

/**
 * Textual spinner to print a message with dotted progress
 * bar.
 */
export class Spinner {
  #animator = {
    frames: [unicodeOr('◒', '•'), unicodeOr('◐', 'o'), unicodeOr('◓', 'O'), unicodeOr('◑', '0')],
    interval: process.platform === 'win32' && !process.env.WT_SESSION ? 120 : 80,
    index: 0,
    tick: 0,
    getFrame() {
      return this.frames[this.index]
    },
    getDots() {
      return '.'.repeat(Math.floor(this.tick / 8) % 4)
    },
    advance() {
      this.index = this.index + 1 === this.frames.length ? 0 : this.index + 1
      this.tick++
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
   * Reference to the colors implementation
   */
  #colors?: Colors

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

    const frame = this.getColors().magenta(this.#animator.getFrame())
    const line = `${frame}  ${this.#message.render()}${this.#animator.getDots()}`

    if (this.#spinnerWriter) {
      this.#spinnerWriter(line)
    } else {
      this.getRenderer().logUpdate(line)
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
   * Returns the colors implementation in use
   */
  getColors(): Colors {
    if (!this.#colors) {
      this.#colors = useColors()
    }

    return this.#colors
  }

  /**
   * Define a custom colors implementation
   */
  useColors(colors: Colors): this {
    this.#colors = colors
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
    this.#animator.tick = 0

    if (!this.#spinnerWriter && !this.#message.silent) {
      this.getRenderer().logUpdate(
        `${this.getColors().green(S_STEP_SUBMIT)}  ${this.#message.render()}`
      )
      this.getRenderer().logUpdatePersist()
    } else if (this.#spinnerWriter && !this.#message.silent) {
      this.#spinnerWriter(`${this.getColors().green(S_STEP_SUBMIT)}  ${this.#message.render()}`)
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
