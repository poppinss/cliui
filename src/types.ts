/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CharName } from 'cli-table3'
import type { Colors } from '@poppinss/colors/types'

export { Colors }

/**
 * Shape of the renderer contract. Renderers are responsible for
 * writing the logs to a destination.
 */
export interface RendererContract {
  getLogs(): { message: string; stream: 'stdout' | 'stderr' }[]

  /**
   * Log a message
   */
  log(message: string): void

  /**
   * Log an error message to stderr
   */
  logError(message: string): void

  /**
   * Log a message that overwrites the existing
   * line
   */
  logUpdate(message: string): void

  /**
   * Persist log message written using "logUpdate"
   */
  logUpdatePersist(): void
}

/**
 * Callback passed while registering task with the tasks manager
 */
export type TaskCallback = (task: {
  /**
   * Update task progress with a log message
   */
  update(logMessage: string): void

  /**
   * Build error to mark the task as failed
   */
  error<T extends string | Error>(error: T): T extends string ? { message: T; isError: true } : T
}) =>
  | Error
  | Promise<Error>
  | { isError: true; message: string }
  | Promise<{ isError: true; message: string }>
  | string
  | Promise<string>

/**
 * Options accepted by the tasks renderers
 */
export type TaskRendererOptions = {
  /**
   * Enable/disable icons.
   *
   * Defaults to "true"
   */
  icons: boolean
}

/**
 * Options accepted by the tasks manager
 */
export type TaskManagerOptions = TaskRendererOptions & {
  /**
   * Display tasks output in raw mode.
   * Defaults to "false".
   *
   * The raw mode is tailored for easy testing
   */
  raw: boolean

  /**
   * Display tasks output in verbose mode.
   * Defaults to "false".
   *
   * The verbose mode displays all the task logs and not
   * just the latest one
   */
  verbose: boolean
}

/**
 * Options accepted by the logger
 */
export type LoggerOptions = {
  /**
   * Output message with dim transformation.
   *
   * Defaults to "false"
   */
  dim: boolean

  /**
   * Output message with dim transformation applied
   * only on the labels.
   *
   * Defaults to "false"
   */
  dimLabels: boolean
}

/**
 * Options accepted by the action
 */
export type ActionOptions = {
  /**
   * Output message with dim transformation.
   *
   * Defaults to "true"
   */
  dim: boolean
}

/**
 * Options accepted by the table
 */
export type TableOptions = {
  /**
   * Disable ansi output
   */
  raw: boolean

  /**
   * Chars to configure the table output
   */
  chars?: Partial<Record<CharName, string>>
}

/**
 * Options accepted by instructions
 */
export type InstructionsOptions = {
  /**
   * Enable/disable icons.
   *
   * Defaults to "true"
   */
  icons: boolean

  /**
   * Display instructions without any ansi output
   */
  raw: boolean
}

/**
 * Logging types
 */
export type LoggingTypes = 'success' | 'error' | 'fatal' | 'warning' | 'info' | 'debug' | 'await'

/**
 * The data type to represent the table head
 */
export type TableHead = (
  | string
  | { colSpan?: number; hAlign?: 'left' | 'center' | 'right'; content: string }
  | { rowSpan?: number; vAlign?: 'top' | 'center' | 'bottom'; content: string }
)[]

/**
 * The data type to represent a table row
 */
export type TableRow =
  | (
      | string
      | { colSpan?: number; hAlign?: 'left' | 'center' | 'right'; content: string }
      | { rowSpan?: number; vAlign?: 'top' | 'center' | 'bottom'; content: string }
    )[]
  | { [key: string]: string[] }

/**
 * Options accepted by the logger when
 * logging messages
 */
export type LoggerMessageOptions = {
  prefix?: string
  suffix?: string
}

/**
 * The message accepted by the spinner
 */
export type SpinnerMessage = {
  text: string
  render(): string
}
