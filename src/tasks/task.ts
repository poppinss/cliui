/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import prettyHrtime from 'pretty-hrtime'

/**
 * Task exposes a very simple API to create tasks with states, along with a
 * listener to listen for the task state updates.
 *
 * The task itself has does not render anything to the console. The task
 * renderers does that.
 */
export class Task {
  #startTime?: [number, number]

  /**
   * Last logged line for the task
   */
  #lastLogLine?: string

  /**
   * Define one or more update listeners
   */
  #updateListeners: ((task: this) => void)[] = []

  /**
   * Duration of the task. Updated after the task is over
   */
  #duration?: string

  /**
   * Message set after completing the task. Can be an error or the
   * a success message
   */
  #completionMessage?: string | { message: string; stack?: string }

  /**
   * Task current state
   */
  #state: 'idle' | 'running' | 'failed' | 'succeeded' = 'idle'

  constructor(public title: string) {}

  #notifyListeners() {
    for (let listener of this.#updateListeners) {
      listener(this)
    }
  }

  /**
   * Access the task state
   */
  getState() {
    return this.#state
  }

  /**
   * Get the time spent in running the task
   */
  getDuration() {
    return this.#duration || null
  }

  /**
   * Get error occurred while running the task
   */
  getError() {
    return this.#completionMessage || null
  }

  /**
   * Get task completion success message
   */
  getSuccessMessage() {
    return typeof this.#completionMessage === 'string' ? this.#completionMessage : null
  }

  /**
   * Last logged line for the task
   */
  getLastLoggedLine() {
    return this.#lastLogLine || null
  }

  /**
   * Bind a listener to listen to the state updates of the task
   */
  onUpdate(listener: (task: this) => void): this {
    this.#updateListeners.push(listener)
    return this
  }

  /**
   * Start the task
   */
  start() {
    this.#state = 'running'
    this.#startTime = process.hrtime()
    this.#notifyListeners()
    return this
  }

  /**
   * Update task with log messages. Based upon the renderer
   * in use, it may only display one line at a time.
   */
  update(message: string): this {
    this.#lastLogLine = message
    this.#notifyListeners()
    return this
  }

  /**
   * Mark task as completed
   */
  markAsSucceeded(message?: string): this {
    this.#state = 'succeeded'
    this.#duration = prettyHrtime(process.hrtime(this.#startTime))
    this.#completionMessage = message
    this.#notifyListeners()
    return this
  }

  /**
   * Mark task as failed
   */
  markAsFailed(error: string | { message: string; stack?: string }): this {
    this.#state = 'failed'
    this.#duration = prettyHrtime(process.hrtime(this.#startTime))
    this.#completionMessage = error
    this.#notifyListeners()
    return this
  }
}
