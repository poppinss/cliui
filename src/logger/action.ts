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

import { useColors } from '../colors.js'
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
   * Format label
   */
  #formatLabel(label: string, color: keyof Colors) {
    label = this.getColors()[color](`${label.toUpperCase()}:`) as string

    if (this.#options.dim) {
      return this.getColors().dim(label)
    }

    return label
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

    return `\n    ${message
      .split('\n')
      .map((line) => {
        if (this.#options.dim) {
          line = this.getColors().dim(line)
        }

        return `     ${this.getColors().red(line)}`
      })
      .join('\n')}`
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
    const formattedLabel = this.#formatLabel('done', 'green')
    const formattedMessage = this.#formatMessage(this.#message)

    let logMessage = `${formattedLabel}    ${formattedMessage}`
    if (this.#displayDuration) {
      logMessage = `${logMessage} ${this.#formatSuffix(
        prettyHrtime(process.hrtime(this.#startTime))
      )}`
    }

    return logMessage
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
    const formattedLabel = this.#formatLabel('skipped', 'cyan')
    const formattedMessage = this.#formatMessage(this.#message)

    let logMessage = `${formattedLabel} ${formattedMessage}`
    if (skipReason) {
      logMessage = `${logMessage} ${this.#formatSuffix(skipReason)}`
    }

    return logMessage
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
    const formattedLabel = this.#formatLabel('failed', 'red')
    const formattedMessage = this.#formatMessage(this.#message)
    const formattedError = this.#formatError(error)

    const logMessage = `${formattedLabel}  ${formattedMessage} ${formattedError}`
    return logMessage
  }

  /**
   * Mark action as failed. An error message is required
   */
  failed(error: string | Error) {
    this.getRenderer().logError(this.prepareFailed(error))
  }
}
