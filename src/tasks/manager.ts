/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Colors } from '@poppinss/colors/types'

import { Task } from './task.js'
import { VerboseRenderer } from './renderers/verbose.js'
import { MinimalRenderer } from './renderers/minimal.js'
import type { TaskManagerOptions, TaskCallback, RendererContract } from '../types.js'
import { RawRenderer } from './renderers/raw.js'

/**
 * Transforms error message
 */
function TRANSFORM_ERROR<T extends string>(error: T): { isError: true; message: string }
function TRANSFORM_ERROR<T extends Error>(error: T): T
function TRANSFORM_ERROR<T extends string | Error>(error: T) {
  if (typeof error === 'string') {
    return { isError: true, message: error }
  }

  return error
}

/**
 * Exposes the API to create a group of tasks and run them in sequence
 */
export class TaskManager {
  /**
   * Options
   */
  #options: TaskManagerOptions

  /**
   * The renderer to use for rendering tasks. The verbose renderer is
   * used When "raw" is set to true.
   */
  #tasksRenderer: MinimalRenderer | VerboseRenderer | RawRenderer

  /**
   * A set of created tasks
   */
  #tasks: { task: Task; callback: TaskCallback }[] = []

  /**
   * State of the tasks manager
   */
  #state: 'idle' | 'running' | 'succeeded' | 'failed' = 'idle'

  constructor(options: Partial<TaskManagerOptions> = {}) {
    this.#options = {
      icons: options.icons === undefined ? true : options.icons,
      raw: options.raw === undefined ? false : options.raw,
      verbose: options.verbose === undefined ? false : options.verbose,
    }

    /**
     * Using verbose renderer when in raw mode
     */
    if (this.#options.raw) {
      this.#tasksRenderer = new RawRenderer()
    } else if (this.#options.verbose) {
      this.#tasksRenderer = new VerboseRenderer()
    } else {
      /**
       * Otheriwse using the minimal renderer
       */
      this.#tasksRenderer = new MinimalRenderer({
        icons: this.#options.icons,
      })
    }
  }

  /**
   * Run a given task. The underlying code assumes that tasks are
   * executed in sequence.
   */
  async #runTask(index: number) {
    const task = this.#tasks[index]
    if (!task) {
      return
    }

    /**
     * Start the underlying task
     */
    task.task.start()

    /**
     * Update task progress
     */
    const update = (logMessage: string) => {
      task.task.update(logMessage)
    }

    /**
     * Invoke callback
     */
    try {
      const response = await task.callback({ error: TRANSFORM_ERROR, update })
      if (typeof response === 'string') {
        task.task.markAsSucceeded(response)
        await this.#runTask(index + 1)
      } else {
        this.#state = 'failed'
        task.task.markAsFailed(response)
      }
    } catch (error) {
      this.#state = 'failed'
      task.task.markAsFailed(error)
    }
  }

  /**
   * Access the task state
   */
  getState() {
    return this.#state
  }

  /**
   * Register a new task
   */
  add(title: string, callback: TaskCallback): this {
    this.#tasks.push({ task: new Task(title), callback })
    return this
  }

  /**
   * Get access to registered tasks
   */
  tasks() {
    return this.#tasks.map(({ task }) => task)
  }

  /**
   * Returns the renderer for rendering the messages
   */
  getRenderer() {
    return this.#tasksRenderer.getRenderer()
  }

  /**
   * Define a custom renderer. Logs to "stdout" and "stderr"
   * by default
   */
  useRenderer(renderer: RendererContract): this {
    this.#tasksRenderer.useRenderer(renderer)
    return this
  }

  /**
   * Define a custom colors implementation
   */
  useColors(color: Colors): this {
    this.#tasksRenderer.useColors(color)
    return this
  }

  /**
   * Run tasks
   */
  async run() {
    if (this.#state !== 'idle') {
      return
    }

    this.#state = 'running'
    this.#tasksRenderer.tasks(this.tasks()).render()
    await this.#runTask(0)

    if (this.#state === 'running') {
      this.#state = 'succeeded'
    }
  }
}
