/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Task } from './index'
import { VerboseRenderer } from './Renderers/Verbose'
import { MinimalRenderer } from './Renderers/Minimal'
import { TaskManagerOptions, TaskCallback, TaskContract, RendererContract } from '../Contracts'

/**
 * Default set of options
 */
const DEFAULTS: TaskManagerOptions = {
  colors: true,
  interactive: true,
  verbose: false,
}

/**
 * Exposes the API to create a group of tasks and run them in sequence
 */
export class TaskManager {
  /**
   * Options
   */
  private options: TaskManagerOptions

  /**
   * The renderer to use for rendering tasks. Automatically decided
   */
  private renderer: MinimalRenderer | VerboseRenderer

  /**
   * A set of created tasks
   */
  private tasks: { task: TaskContract; callback: TaskCallback }[] = []

  /**
   * State of the tasks manager
   */
  public state: 'idle' | 'running' | 'succeeded' | 'failed' = 'idle'

  /**
   * Reference to the error raised by the task callback (if any)
   */
  public error?: any

  constructor(options?: Partial<TaskManagerOptions>, private testing: boolean = false) {
    this.options = { ...DEFAULTS, ...options }
    this.instantiateRenderer()
  }

  /**
   * Instantiates the tasks renderer
   */
  private instantiateRenderer() {
    const rendererOptions = {
      colors: this.options.colors,
      interactive: this.options.interactive,
    }

    /**
     * Using verbose render when verbose option is true or terminal is not
     * interactive
     */
    if (this.options.verbose || this.testing || !this.options.interactive) {
      this.renderer = new VerboseRenderer(rendererOptions, this.testing)
      return
    }

    /**
     * Otheriwse using the minimal renderer
     */
    this.renderer = new MinimalRenderer(rendererOptions, this.testing)
  }

  /**
   * Run a given task. The underlying code assumes that tasks are
   * executed in sequence.
   */
  private async runTask(index: number) {
    const task = this.tasks[index]
    if (!task) {
      return
    }

    /**
     * Start the underlying task
     */
    task.task.start()

    /**
     * Method to invoke when callback has been completed
     */
    const complete = async (message: any) => {
      if (task.task.state !== 'running') {
        return
      }

      task.task.complete(message)
      await this.runTask(index + 1)
    }

    /**
     * Method to invoke when callback has been failed
     */
    const fail = async (message: any) => {
      if (task.task.state !== 'running') {
        return
      }

      this.error = message
      this.state = 'failed'
      task.task.fail(message)
    }

    /**
     * Invoke callback
     */
    try {
      await task.callback(this.renderer.logger, { complete, fail })
    } catch (error) {
      await fail(error)
    }
  }

  /**
   * Register a new task
   */
  public add(title: string, callback: TaskCallback): this {
    this.tasks.push({ task: new Task(title), callback })
    return this
  }

  /**
   * Define a custom logging renderer. Logs to "stdout" and "stderr"
   * by default
   */
  public useRenderer(renderer: RendererContract): this {
    this.renderer.useRenderer(renderer)
    return this
  }

  /**
   * Run tasks
   */
  public async run() {
    if (this.state !== 'idle') {
      return
    }

    this.state = 'running'
    this.renderer.tasks(this.tasks.map(({ task }) => task)).render()
    await this.runTask(0)

    if (this.state === 'running') {
      this.state = 'succeeded'
    }
  }
}
