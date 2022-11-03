/*
 * @poppinss/utils
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RendererContract } from '../types.js'

/**
 * Keeps log messages within memory. Useful for testing
 */
export class MemoryRenderer implements RendererContract {
  #logs: { message: string; stream: 'stdout' | 'stderr' }[] = []

  getLogs() {
    return this.#logs
  }

  /**
   * Log message
   */
  log(message: string) {
    this.#logs.push({ message, stream: 'stdout' })
  }

  /**
   * For memory renderer the logUpdate is similar to log
   */
  logUpdate(message: string) {
    this.log(message)
  }

  /**
   * Its a noop
   */
  logUpdatePersist() {}

  /**
   * Log message as error
   */
  logError(message: string) {
    this.#logs.push({ message, stream: 'stderr' })
  }
}
