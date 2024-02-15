/*
 * @poppinss/clui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Colors } from '@poppinss/colors/types'

import { Action } from './action.js'
import { Spinner } from './spinner.js'
import { useColors } from '../colors.js'
import { ConsoleRenderer } from '../renderers/console.js'

import type {
  LoggingTypes,
  LoggerOptions,
  RendererContract,
  LoggerMessageOptions,
} from '../types.js'

/**
 * CLI logger to log messages to the console. The output is consistently
 * formatted.
 */
export class Logger implements RendererContract {
  /**
   * Logger configuration options
   */
  #options: LoggerOptions

  /**
   * Reference to the colors implementation
   */
  #colors?: Colors

  /**
   * The renderer to use to output logs
   */
  #renderer?: RendererContract

  getLogs(): { message: string; stream: 'stdout' | 'stderr' }[] {
    return this.getRenderer().getLogs()
  }

  flushLogs(): void {
    this.getRenderer().flushLogs()
  }

  constructor(options: Partial<LoggerOptions> = {}) {
    const dimOutput = options.dim === undefined ? false : options.dim

    this.#options = {
      dim: dimOutput,
      dimLabels: options.dimLabels === undefined ? dimOutput : options.dimLabels,
    }
  }

  /**
   * Color the logger label
   */
  #colorizeLabel(color: keyof Colors, text: string): string {
    text = this.getColors()[color](text) as string

    if (this.#options.dimLabels) {
      return `[ ${this.getColors().dim(text)} ]`
    }

    return `[ ${text} ]`
  }

  /**
   * Returns the label for a given logging type
   */
  #getLabel(type: LoggingTypes): string {
    switch (type) {
      case 'success':
        return this.#colorizeLabel('green', type)
      case 'error':
      case 'fatal':
        return this.#colorizeLabel('red', type)
      case 'warning':
        return this.#colorizeLabel('yellow', 'warn')
      case 'info':
        return this.#colorizeLabel('blue', type)
      case 'debug':
        return this.#colorizeLabel('cyan', type)
      case 'await':
        return this.#colorizeLabel('cyan', 'wait')
    }
  }

  /**
   * Appends the suffix to the message
   */
  #addSuffix(message: string, suffix?: string): string {
    if (!suffix) {
      return message
    }

    return `${message} ${this.getColors().dim().yellow(`(${suffix})`)}`
  }

  /**
   * Prepends the prefix to the message. We do not DIM the prefix, since
   * gray doesn't have much brightness already
   */
  #addPrefix(message: string, prefix?: string): string {
    if (!prefix) {
      return message
    }

    prefix = prefix.replace(/%time%/, new Date().toISOString())
    return `${this.getColors().dim(`[${prefix}]`)} ${message}`
  }

  /**
   * Prepends the prefix to the message
   */
  #prefixLabel(message: string, label: string) {
    return `${label} ${message}`
  }

  /**
   * Decorate message string
   */
  #decorateMessage(message: string): string {
    if (this.#options.dim) {
      return this.getColors().dim(message)
    }

    return message
  }

  /**
   * Decorate error stack
   */
  #formatStack(stack?: string): string {
    if (!stack) {
      return ''
    }

    return `\n${stack
      .split('\n')
      .splice(1)
      .map((line) => {
        if (this.#options.dim) {
          line = this.getColors().dim(line)
        }

        return `      ${this.getColors().red(line)}`
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
   * Define a custom renderer to output logos
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
   * Log message
   */
  log(message: string) {
    this.getRenderer().log(message)
  }

  /**
   * Log message by updating the existing line
   */
  logUpdate(message: string) {
    this.getRenderer().logUpdate(message)
  }

  /**
   * Persist log line written using the `logUpdate`
   * method.
   */
  logUpdatePersist() {
    this.getRenderer().logUpdatePersist()
  }

  /**
   * Log error message using the renderer. It is similar to `console.error`
   * but uses the underlying renderer instead
   */
  logError(message: string) {
    this.getRenderer().logError(message)
  }

  /**
   * Prepares the success message
   */
  prepareSuccess(message: string, options?: LoggerMessageOptions) {
    message = this.#decorateMessage(message)
    message = this.#prefixLabel(message, this.#getLabel('success'))
    message = this.#addPrefix(message, options?.prefix)
    message = this.#addSuffix(message, options?.suffix)
    return message
  }

  /**
   * Log success message
   */
  success(message: string, options?: LoggerMessageOptions) {
    this.log(this.prepareSuccess(message, options))
  }

  /**
   * Prepares the error message
   */
  prepareError(message: string | { message: string }, options?: LoggerMessageOptions) {
    message = typeof message === 'string' ? message : message.message
    message = this.#decorateMessage(message)
    message = this.#prefixLabel(message, this.#getLabel('error'))
    message = this.#addPrefix(message, options?.prefix)
    message = this.#addSuffix(message, options?.suffix)

    return message
  }

  /**
   * Log error message
   */
  error(message: string | { message: string }, options?: LoggerMessageOptions) {
    this.logError(this.prepareError(message, options))
  }

  /**
   * Prepares the fatal message
   */
  prepareFatal(
    message: string | { message: string; stack?: string },
    options?: LoggerMessageOptions
  ) {
    const stack = this.#formatStack(typeof message === 'string' ? undefined : message.stack)

    message = typeof message === 'string' ? message : message.message
    message = this.#decorateMessage(message)
    message = this.#prefixLabel(message, this.#getLabel('error'))
    message = this.#addPrefix(message, options?.prefix)
    message = this.#addSuffix(message, options?.suffix)

    return `${message}${stack}`
  }

  /**
   * Log fatal message
   */
  fatal(message: string | { message: string; stack?: string }, options?: LoggerMessageOptions) {
    this.logError(this.prepareFatal(message, options))
  }

  /**
   * Prepares the warning message
   */
  prepareWarning(message: string, options?: LoggerMessageOptions) {
    message = this.#decorateMessage(message)
    message = this.#prefixLabel(message, this.#getLabel('warning'))
    message = this.#addPrefix(message, options?.prefix)
    message = this.#addSuffix(message, options?.suffix)

    return message
  }

  /**
   * Log warning message
   */
  warning(message: string, options?: LoggerMessageOptions) {
    this.log(this.prepareWarning(message, options))
  }

  /**
   * Prepares the info message
   */
  prepareInfo(message: string, options?: LoggerMessageOptions) {
    message = this.#decorateMessage(message)
    message = this.#prefixLabel(message, this.#getLabel('info'))
    message = this.#addPrefix(message, options?.prefix)
    message = this.#addSuffix(message, options?.suffix)

    return message
  }

  /**
   * Log info message
   */
  info(message: string, options?: LoggerMessageOptions) {
    this.log(this.prepareInfo(message, options))
  }

  /**
   * Prepares the debug message
   */
  prepareDebug(message: string, options?: LoggerMessageOptions) {
    message = this.#decorateMessage(message)
    message = this.#prefixLabel(message, this.#getLabel('debug'))
    message = this.#addPrefix(message, options?.prefix)
    message = this.#addSuffix(message, options?.suffix)

    return message
  }

  /**
   * Log debug message
   */
  debug(message: string, options?: LoggerMessageOptions) {
    this.log(this.prepareDebug(message, options))
  }

  /**
   * Log a message with a spinner
   */
  await(text: string, options?: LoggerMessageOptions) {
    const message = {
      logger: this,
      text,
      ...options,
      render() {
        let decorated = this.logger.#decorateMessage(this.text)
        decorated = this.logger.#prefixLabel(decorated, this.logger.#getLabel('await'))
        decorated = this.logger.#addPrefix(decorated, this.prefix)
        decorated = this.logger.#addSuffix(decorated, this.suffix)
        return decorated
      },
    }

    return new Spinner(message).useRenderer(this.getRenderer())
  }

  /**
   * Initiates a new action
   */
  action(title: string) {
    return new Action(title, { dim: this.#options.dim })
      .useColors(this.getColors())
      .useRenderer(this.getRenderer())
  }

  /**
   * Create a new child instance of self
   */
  child(options?: Partial<LoggerOptions>): Logger {
    return new (this.constructor as typeof Logger)(options)
      .useColors(this.getColors())
      .useRenderer(this.getRenderer())
  }
}
