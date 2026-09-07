/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Colors } from '@poppinss/colors/types'
import { log as clackLog, S_BAR, S_ERROR, S_STEP_SUBMIT, S_SUCCESS } from '@clack/prompts'

import { type Task } from '../task.js'
import { useColors } from '../../colors.js'
import type { RendererContract } from '../../types.js'
import { captureClackOutput } from '../../renderers/clack.js'
import { ConsoleRenderer } from '../../renderers/console.js'

/**
 * Verbose renderer shows a detailed output of the tasks and the
 * messages logged by a given task
 */
export class VerboseRenderer {
  /**
   * Reference to the colors implementation
   */
  #colors?: Colors

  /**
   * The renderer to use to output logs
   */
  #renderer?: RendererContract

  /**
   * List of registered tasks
   */
  #registeredTasks: Task[] = []

  #notifiedTasks: Set<string> = new Set()

  constructor() {}

  /**
   * Format error
   */
  #formatError(error: string | { message: string; stack?: string }) {
    if (typeof error === 'string') {
      return this.getColors().red(error)
    }

    if (!error.stack) {
      return this.getColors().red(error.message)
    }

    return `${error.stack
      .split('\n')
      .map((line) => this.getColors().red(line))
      .join('\n')}`
  }

  /**
   * Render a message through Clack while preserving the configured renderer.
   */
  #formatMessage(message: string, symbol: string) {
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
   * Renders message for a running task
   */
  #renderRunningTask(task: Task) {
    if (this.#notifiedTasks.has(task.title)) {
      const lastLoggedLine = task.getLastLoggedLine()
      if (lastLoggedLine) {
        this.getRenderer().log(this.#formatMessage(lastLoggedLine, this.getColors().gray(S_BAR)))
      }

      return
    }

    this.getRenderer().log(this.#formatMessage(task.title, this.getColors().green(S_SUCCESS)))
    this.#notifiedTasks.add(task.title)
  }

  /**
   * Renders message for a succeeded task
   */
  #renderSucceededTask(task: Task) {
    const successMessage = task.getSuccessMessage()
    const status = this.getColors().green(successMessage || 'Completed')
    const duration = this.getColors().dim(`(${task.getDuration()})`)
    this.getRenderer().log(
      this.#formatMessage(`${status} ${duration}`, this.getColors().green(S_STEP_SUBMIT))
    )
  }

  /**
   * Renders message for a failed task
   */
  #renderFailedTask(task: Task) {
    const error = task.getError()
    if (error) {
      this.getRenderer().logError(
        this.#formatMessage(this.#formatError(error), this.getColors().gray(S_BAR))
      )
    }

    const status = this.getColors().red('Failed')
    const duration = this.getColors().dim(`(${task.getDuration()})`)
    this.getRenderer().logError(
      this.#formatMessage(`${status} ${duration}`, this.getColors().red(S_ERROR))
    )
  }

  /**
   * Renders a given task
   */
  #renderTask(task: Task) {
    switch (task.getState()) {
      case 'running':
        return this.#renderRunningTask(task)
      case 'succeeded':
        return this.#renderSucceededTask(task)
      case 'failed':
        return this.#renderFailedTask(task)
    }
  }

  /**
   * Renders all tasks
   */
  #renderTasks() {
    this.#registeredTasks.forEach((task) => this.#renderTask(task))
  }

  /**
   * Returns the renderer for rendering the messages
   */
  getRenderer() {
    if (!this.#renderer) {
      this.#renderer = new ConsoleRenderer()
    }

    return this.#renderer
  }

  /**
   * Define a custom renderer. Logs to "stdout" and "stderr"
   * by default
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
   * Register tasks to render
   */
  tasks(tasks: Task[]): this {
    this.#registeredTasks = tasks
    return this
  }

  /**
   * Render all tasks
   */
  render() {
    this.#registeredTasks.forEach((task) => task.onUpdate(($task) => this.#renderTask($task)))
    this.#renderTasks()
  }
}
