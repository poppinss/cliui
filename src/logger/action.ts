/*
 * @poppinss/utils
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import prettyHrtime from 'pretty-hrtime'
import type { Colors } from '@poppinss/colors/types'
import { log as clackLog, S_BAR, S_ERROR, S_RADIO_INACTIVE, S_STEP_SUBMIT } from '@clack/prompts'

import { useColors } from '../colors.js'
import { captureClackOutput } from '../renderers/clack.js'
import { ConsoleRenderer } from '../renderers/console.js'
import type { ActionOptions, RendererContract } from '../types.js'

/**
 * Exposes the API to print actions in one of the following three states
 *
 * - failed
 * - succeeded
 * - skipped
 */
export class Action {
  #startTime?: [number, number]

  /**
   * Action options
   */
  #options: ActionOptions

  /**
   * Action message
   */
  #message: string

  /**
   * Reference to the colors implementation
   */
  #colors?: Colors

  /**
   * The renderer to use for writing to the console
   */
  #renderer?: RendererContract

  /**
   * Whether or not to display duration of the action
   */
  #displayDuration: boolean = false

  constructor(message: string, options: Partial<ActionOptions> = {}) {
    this.#message = message
    this.#startTime = process.hrtime()
    this.#options = {
      dim: options.dim === undefined ? false : options.dim,
    }
  }

  /**
   * Format message
   */
  #formatMessage(message: string) {
    if (this.#options.dim) {
      return this.getColors().dim(message)
    }

    return message
  }

  /**
   * Format the suffix
   */
  #formatSuffix(message: string) {
    message = `(${message})`
    return this.getColors().dim(message)
  }

  /**
   * Format error
   */
  #formatError(error: string | Error) {
    let message = typeof error === 'string' ? error : error.stack || error.message

    return message
      .split('\n')
      .map((line) => {
        if (this.#options.dim) {
          line = this.getColors().dim(line)
        }

        return this.getColors().red(line)
      })
      .join('\n')
  }

  /**
   * Render an action through Clack while preserving CLIUI's renderer contract.
   */
  #formatAction(message: string, symbol: string) {
    if (this.#options.dim) {
      symbol = this.getColors().dim(symbol)
    }

    return captureClackOutput((output) => {
      clackLog.message(message, {
        output,
        symbol,
        spacing: 0,
        secondarySymbol: this.getColors().gray(S_BAR),
      })
    })
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
   * Define a custom renderer.
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
  useColors(color: Colors): this {
    this.#colors = color
    return this
  }

  /**
   * Toggle whether to display duration for completed
   * tasks or not.
   */
  displayDuration(displayDuration: boolean = true) {
    this.#displayDuration = displayDuration
    return this
  }

  /**
   * Prepares the message to mark action as successful
   */
  prepareSucceeded() {
    let message = this.#formatMessage(this.#message)

    if (this.#displayDuration) {
      message = `${message} ${this.#formatSuffix(prettyHrtime(process.hrtime(this.#startTime)))}`
    }

    return this.#formatAction(message, this.getColors().green(S_STEP_SUBMIT))
  }

  /**
   * Mark action as successful
   */
  succeeded() {
    this.getRenderer().log(this.prepareSucceeded())
  }

  /**
   * Prepares the message to mark action as skipped
   */
  prepareSkipped(skipReason?: string) {
    let message = this.#formatMessage(this.#message)

    if (skipReason) {
      message = `${message} ${this.#formatSuffix(skipReason)}`
    }

    return this.#formatAction(message, this.getColors().gray(S_RADIO_INACTIVE))
  }

  /**
   * Mark action as skipped. An optional skip reason can be
   * supplied
   */
  skipped(skipReason?: string) {
    this.getRenderer().log(this.prepareSkipped(skipReason))
  }

  /**
   * Prepares the message to mark action as failed
   */
  prepareFailed(error: string | Error) {
    const message = this.#formatMessage(this.#message)
    const formattedError = this.#formatError(error)

    return this.#formatAction(`${message}\n${formattedError}`, this.getColors().red(S_ERROR))
  }

  /**
   * Mark action as failed. An error message is required
   */
  failed(error: string | Error) {
    this.getRenderer().logError(this.prepareFailed(error))
  }
}
