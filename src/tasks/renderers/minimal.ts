/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Colors } from '@poppinss/colors/types'
import { S_BAR, S_ERROR, S_RADIO_INACTIVE, S_STEP_SUBMIT, unicodeOr } from '@clack/prompts'

import { type Task } from '../task.js'
import { useColors } from '../../colors.js'
import { ConsoleRenderer } from '../../renderers/console.js'
import type { TaskRendererOptions, RendererContract } from '../../types.js'

/**
 * As the name suggests, render tasks in minimal UI for better viewing
 * experience.
 */
export class MinimalRenderer {
  /**
   * Renderer options
   */
  #options: TaskRendererOptions

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

  constructor(options: TaskRendererOptions) {
    this.#options = {
      icons: options.icons === undefined ? true : options.icons,
    }
  }

  /**
   * Format error
   */
  #formatError(error: string | { message: string; stack?: string }) {
    let message = typeof error === 'string' ? error : error.message
    message = this.getColors().red(message)
    const guide = this.#getSymbol(S_BAR, 'gray')

    return `\n${message
      .split('\n')
      .map((line) => `${guide}${line}`)
      .join('\n')}`
  }

  /**
   * Returns a Clack symbol, if icons are not disabled.
   */
  #getSymbol(symbol: string, color: keyof Colors) {
    if (!this.#options.icons) {
      return ''
    }

    return `${this.getColors()[color](symbol)}  `
  }

  /**
   * Returns the display string for an idle task
   */
  #renderIdleTask(task: Task) {
    return `${this.#getSymbol(S_RADIO_INACTIVE, 'gray')}${this.getColors().dim(task.title)}`
  }

  /**
   * Returns the display string for a running task
   */
  #renderRunningTask(task: Task) {
    const lastLogLine = task.getLastLoggedLine()
    const title = `${this.#getSymbol(unicodeOr('◒', '•'), 'magenta')}${task.title}`
    const guide = this.#getSymbol(S_BAR, 'gray')

    return `${title}\n${guide}${lastLogLine || ''}`
  }

  /**
   * Returns the display string for a failed task
   */
  #renderFailedTask(task: Task) {
    const pointer = this.#getSymbol(S_ERROR, 'red')
    const duration = this.getColors().dim(`(${task.getDuration()!})`)

    let message = `${pointer}${task.title} ${duration}`

    const error = task.getError()
    if (!error) {
      return `${message}\n`
    }

    message = `${message}${this.#formatError(error)}`
    return message
  }

  /**
   * Returns the display string for a succeeded task
   */
  #renderSucceededTask(task: Task) {
    const pointer = this.#getSymbol(S_STEP_SUBMIT, 'green')
    const duration = this.getColors().dim(`(${task.getDuration()!})`)

    let message = `${pointer}${task.title} ${duration}`

    const successMessage = task.getSuccessMessage()
    if (!successMessage) {
      return `${message}\n`
    }

    message = `${message}\n${this.#getSymbol(S_BAR, 'gray')}${this.getColors().green(successMessage)}`
    return message
  }

  /**
   * Renders a given task
   */
  #renderTask(task: Task): string {
    switch (task.getState()) {
      case 'idle':
        return this.#renderIdleTask(task)
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
    const lastTaskState = this.#registeredTasks[this.#registeredTasks.length - 1].getState()
    this.getRenderer().logUpdate(
      this.#registeredTasks.map((task) => this.#renderTask(task)).join('\n')
    )
    if (lastTaskState === 'succeeded' || lastTaskState === 'failed') {
      this.getRenderer().logUpdatePersist()
    }
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
    this.#registeredTasks.forEach((task) => {
      task.onUpdate(() => this.#renderTasks())
    })
    this.#renderTasks()
  }
}
