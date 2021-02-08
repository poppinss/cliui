/*
 * @poppinss/clui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Colors } from '@poppinss/colors'

import { Action } from './Action'
import { getBest } from '../Colors'
import { Spinner } from './Spinner'
import { ConsoleRenderer } from '../Renderer/Console'
import { LoggerOptions, RendererContract, LoggingTypes } from '../Contracts'

/**
 * Default config options
 */
const DEFAULTS: LoggerOptions = {
  dim: false,
  dimLabels: false,
  colors: true,
  labelColors: true,
  interactive: true,
}

/**
 * Logger exposes the API to log messages with consistent styles
 * and colors
 */
export class Logger {
  /**
   * Logger configuration options
   */
  public options: LoggerOptions

  /**
   * The colors reference
   */
  public colors: ReturnType<typeof getBest>

  /**
   * The label colors reference
   */
  private labelColors: ReturnType<typeof getBest>

  /**
   * The renderer to use to output logs
   */
  private renderer?: RendererContract

  constructor(options?: Partial<LoggerOptions>, private testing: boolean = false) {
    this.options = { ...DEFAULTS, ...options }
    this.colors = getBest(this.testing, this.options.colors)
    this.labelColors = getBest(this.testing, this.options.labelColors && this.options.colors)
  }

  /**
   * Colors the logger label
   */
  private colorizeLabel(color: keyof Colors, text: string): string {
    if (this.options.dim || this.options.dimLabels) {
      return `[ ${this.labelColors.dim()[color](text)} ]`
    }

    return `[ ${this.labelColors[color](text)} ]`
  }

  /**
   * Returns the label for a given logging type
   */
  private getLabel(type: LoggingTypes): string {
    switch (type) {
      case 'success':
        return this.colorizeLabel('green', 'success')
      case 'error':
      case 'fatal':
        return this.colorizeLabel('red', type)
      case 'warning':
        return this.colorizeLabel('yellow', 'warn')
      case 'info':
        return this.colorizeLabel('blue', 'info')
      case 'debug':
        return this.colorizeLabel('cyan', 'debug')
      case 'await':
        return this.colorizeLabel('cyan', 'wait')
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
    return `${this.colors.dim(`[${prefix}]`)} ${message}`
  }

  /**
   * Prepends the prefix to the message
   */
  private prefixLabel(message: string, label: string) {
    return `${label}  ${message}`
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
   * Log message using the renderer. It is similar to `console.log`
   * but uses the underlying renderer instead
   */
  public log(message: string) {
    this.getRenderer().log(message)
  }

  /**
   * Log message by overwriting the existing one
   */
  public logUpdate(message: string) {
    this.getRenderer().logUpdate(message)
  }

  /**
   * Persist the message logged using [[this.logUpdate]]
   */
  public logUpdatePersist() {
    this.getRenderer().logUpdateDone()
  }

  /**
   * Log error message using the renderer. It is similar to `console.error`
   * but uses the underlying renderer instead
   */
  public logError(message: string) {
    this.getRenderer().logError(message)
  }

  /**
   * Log success message
   */
  public success(message: string, prefix?: string, suffix?: string) {
    message = this.decorateMessage(message)
    message = this.prefixLabel(message, this.getLabel('success'))
    message = this.addPrefix(message, prefix)
    message = this.addSuffix(message, suffix)

    this.log(message)
  }

  /**
   * Log error message
   */
  public error(message: string | { message: string }, prefix?: string, suffix?: string) {
    message = typeof message === 'string' ? message : message.message
    message = this.decorateMessage(message)
    message = this.prefixLabel(message, this.getLabel('error'))
    message = this.addPrefix(message, prefix)
    message = this.addSuffix(message, suffix)

    this.logError(message)
  }

  /**
   * Log fatal message
   */
  public fatal(
    message: string | { message: string; stack?: string },
    prefix?: string,
    suffix?: string
  ) {
    const stack = this.formatStack(typeof message === 'string' ? undefined : message.stack)

    message = typeof message === 'string' ? message : message.message
    message = this.decorateMessage(message)
    message = this.prefixLabel(message, this.getLabel('error'))
    message = this.addPrefix(message, prefix)
    message = this.addSuffix(message, suffix)

    this.logError(`${message}${stack}`)
  }

  /**
   * Log warning message
   */
  public warning(message: string, prefix?: string, suffix?: string) {
    message = this.decorateMessage(message)
    message = this.prefixLabel(message, this.getLabel('warning'))
    message = this.addPrefix(message, prefix)
    message = this.addSuffix(message, suffix)

    this.log(message)
  }

  /**
   * Log info message
   */
  public info(message: string, prefix?: string, suffix?: string) {
    message = this.decorateMessage(message)
    message = this.prefixLabel(message, this.getLabel('info'))
    message = this.addPrefix(message, prefix)
    message = this.addSuffix(message, suffix)

    this.log(message)
  }

  /**
   * Log debug message
   */
  public debug(message: string, prefix?: string, suffix?: string) {
    message = this.decorateMessage(message)
    message = this.prefixLabel(message, this.getLabel('debug'))
    message = this.addPrefix(message, prefix)
    message = this.addSuffix(message, suffix)

    this.log(message)
  }

  /**
   * Log a message with a spinner
   */
  public await(message: string, prefix?: string, suffix?: string) {
    const messageBuilder = {
      prefix: prefix,
      suffix: suffix,
      logger: this,
      render(text: string) {
        text = this.logger.decorateMessage(text)
        text = this.logger.prefixLabel(text, this.logger.getLabel('await'))
        text = this.logger.addPrefix(text, this.prefix)
        text = this.logger.addSuffix(text, this.suffix)
        return text
      },
    }

    return new Spinner(message, this, this.testing).useMessageBuilder(messageBuilder).start()
  }

  /**
   * Initiates a new action
   */
  public action(title: string) {
    return new Action(title, this)
  }
}
