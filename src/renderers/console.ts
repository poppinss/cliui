/*
 * @poppinss/utils
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import logUpdate from 'log-update'
import type { RendererContract } from '../types.js'

/**
 * Renders messages to the "stdout" and "stderr"
 */
export class ConsoleRenderer implements RendererContract {
  getLogs() {
    return []
  }

  flushLogs(): void {}

  log(message: string) {
    console.log(message)
  }

  /**
   * Log message by overwriting the existing one
   */
  logUpdate(message: string) {
    logUpdate(message)
  }

  /**
   * Persist the last logged message
   */
  logUpdatePersist() {
    logUpdate.done()
  }

  /**
   * Log error
   */
  logError(message: string) {
    console.error(message)
  }
}
