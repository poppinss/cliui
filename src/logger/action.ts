/*
 * @poppinss/utils
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
  /**
   * Action options
   */
  #options: ActionOptions

  /**
   * Action label
   */
  #label: string

  /**
   * Reference to the colors implementation
   */
  #colors?: Colors

  /**
   * The renderer to use for writing to the console
   */
  #renderer?: RendererContract

  constructor(label: string, options: Partial<ActionOptions> = {}) {
    this.#label = label
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
   * Format the skip reason
   */
  #formatSkipReason(skipReason: string) {
    skipReason = `(${skipReason})`
    return this.getColors().dim(skipReason)
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

        return `    ${this.getColors().red(line)}`
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
   * Prepares the message to mark action as successful
   */
  prepareSucceeded(message: string) {
    const formattedLabel = this.#formatLabel(this.#label, 'green')
    const formattedMessage = this.#formatMessage(message)
    return `${formattedLabel} ${formattedMessage}`
  }

  /**
   * Mark action as successful
   */
  succeeded(message: string) {
    this.getRenderer().log(this.prepareSucceeded(message))
  }

  /**
   * Prepares the message to mark action as skipped
   */
  prepareSkipped(message: string, skipReason?: string) {
    const formattedLabel = this.#formatLabel('skip', 'cyan')
    const formattedMessage = this.#formatMessage(message)

    let logMessage = `${formattedLabel}   ${formattedMessage}`
    if (skipReason) {
      logMessage = `${logMessage} ${this.#formatSkipReason(skipReason)}`
    }

    return logMessage
  }

  /**
   * Mark action as skipped. An optional skip reason can be
   * supplied
   */
  skipped(message: string, skipReason?: string) {
    this.getRenderer().log(this.prepareSkipped(message, skipReason))
  }

  /**
   * Prepares the message to mark action as failed
   */
  prepareFailed(message: string, error: string | Error) {
    const formattedLabel = this.#formatLabel('error', 'red')
    const formattedMessage = this.#formatMessage(message)
    const formattedError = this.#formatError(error)

    const logMessage = `${formattedLabel}  ${formattedMessage} ${formattedError}`
    return logMessage
  }

  /**
   * Mark action as failed. An error message is required
   */
  failed(message: string, error: string | Error) {
    this.getRenderer().logError(this.prepareFailed(message, error))
  }
}
