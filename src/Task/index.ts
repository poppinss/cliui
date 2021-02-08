/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import prettyHrtime from 'pretty-hrtime'
import { TaskContract, UpdateListener } from '../Contracts'

/**
 * Task exposes a very simple API to create tasks with states, along with a
 * listener to listen for the task state updates.
 *
 * The task itself has does not render anything to the console. The task
 * renderers does that.
 */
export class Task implements TaskContract {
  private startTime: [number, number]
  private onUpdateListener: UpdateListener = () => {}

  /**
   * Duration of the task. Updated after the task is over
   */
  public duration?: string

  /**
   * Message set after completing the task. Can be an error or the
   * a success message
   */
  public completionMessage?: TaskContract['completionMessage']

  /**
   * Task current state
   */
  public state: TaskContract['state'] = 'idle'

  constructor(public title: string) {}

  /**
   * Bind a listener to listen to the state updates of the task
   */
  public onUpdate(listener: UpdateListener): this {
    this.onUpdateListener = listener
    return this
  }

  /**
   * Start the task
   */
  public start() {
    this.state = 'running'
    this.startTime = process.hrtime()
    this.onUpdateListener?.(this)
    return this
  }

  /**
   * Mark task as completed
   */
  public complete(message?: string): this {
    this.state = 'succeeded'
    this.duration = prettyHrtime(process.hrtime(this.startTime))
    this.completionMessage = message
    this.onUpdateListener?.(this)
    return this
  }

  /**
   * Mark task as failed
   */
  public fail(error: TaskContract['completionMessage']): this {
    this.state = 'failed'
    this.duration = prettyHrtime(process.hrtime(this.startTime))
    this.completionMessage = error
    this.onUpdateListener?.(this)
    return this
  }
}
