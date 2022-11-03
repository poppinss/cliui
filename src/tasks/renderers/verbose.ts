/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Colors } from '@poppinss/colors/types'

import { Task } from '../task.js'
import { useColors } from '../../colors.js'
import type { RendererContract } from '../../types.js'
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
      return `${this.#getAnsiIcon('│', 'dim')}${this.getColors().red(error)}`
    }

    if (!error.stack) {
      return `${this.#getAnsiIcon('│', 'dim')}${this.getColors().red(error.message)}`
    }

    return `${error.stack
      .split('\n')
      .map((line) => `${this.#getAnsiIcon('│', 'dim')} ${this.getColors().red(line)}`)
      .join('\n')}`
  }

  /**
   * Returns the ansi icon back when icons are enabled
   * or an empty string
   */
  #getAnsiIcon(icon: string, color: keyof Colors) {
    return this.getColors()[color](`${icon} `)
  }

  /**
   * Renders message for a running task
   */
  #renderRunningTask(task: Task) {
    if (this.#notifiedTasks.has(task.title)) {
      const lastLoggedLine = task.getLastLoggedLine()
      if (lastLoggedLine) {
        this.getRenderer().log(`${this.#getAnsiIcon('│', 'dim')}${lastLoggedLine}`)
      }

      return
    }

    this.getRenderer().log(`${this.#getAnsiIcon('┌', 'dim')}${task.title}`)
    this.#notifiedTasks.add(task.title)
  }

  /**
   * Renders message for a succeeded task
   */
  #renderSucceededTask(task: Task) {
    const successMessage = task.getSuccessMessage()
    const icon = this.#getAnsiIcon('└', 'dim')
    const status = this.getColors().green(successMessage || 'Completed')
    const duration = this.getColors().dim(`(${task.getDuration()})`)
    this.getRenderer().log(`${icon}${status} ${duration}`)
  }

  /**
   * Renders message for a failed task
   */
  #renderFailedTask(task: Task) {
    const error = task.getError()
    if (error) {
      this.getRenderer().logError(this.#formatError(error))
    }

    const icon = this.#getAnsiIcon('└', 'dim')
    const status = this.getColors().red('Failed')
    const duration = this.getColors().dim(`(${task.getDuration()})`)
    this.getRenderer().logError(`${icon}${status} ${duration}`)
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
