/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import supportsColor from 'supports-color'

import { icons } from './src/icons.js'
import { Table } from './src/table.js'
import { useColors } from './src/colors.js'
import { Logger } from './src/logger/main.js'
import { Instructions } from './src/instructions.js'
import { TaskManager } from './src/tasks/manager.js'
import { MemoryRenderer } from './src/renderers/memory.js'
import { ConsoleRenderer } from './src/renderers/console.js'
import type { TableOptions, TaskManagerOptions } from './src/types.js'

export { Logger, Table, TaskManager, Instructions, icons }

/**
 * Create a new CLI UI instance.
 *
 * - The "raw" mode is tailored for testing
 * - The "silent" mode should be used when the terminal does not support colors. We
 *   automatically perform the detection
 */
export function cliui(options: Partial<{ raw: boolean; silent: boolean }> = {}) {
  const normalizedOptions = Object.assign(
    {
      raw: false,
      silent: !supportsColor.stdout,
    },
    options
  )

  /**
   * Renderer to use
   */
  const renderer = normalizedOptions.raw ? new MemoryRenderer() : new ConsoleRenderer()

  /**
   * Colors instance in use
   */
  const colors = useColors(normalizedOptions)

  /**
   * Logger
   */
  const logger = new Logger()
  logger.useRenderer(renderer)
  logger.useColors(colors)

  /**
   * Render instructions inside a box
   */
  const instructions = () => {
    const instructionsInstance = new Instructions({ icons: true, raw: normalizedOptions.raw })
    instructionsInstance.useRenderer(renderer)
    instructionsInstance.useColors(colors)
    return instructionsInstance
  }

  /**
   * Similar to instructions. But without the `pointer` icon
   */
  const sticker = () => {
    const instructionsInstance = new Instructions({ icons: false, raw: normalizedOptions.raw })
    instructionsInstance.useRenderer(renderer)
    instructionsInstance.useColors(colors)
    return instructionsInstance
  }

  /**
   * Initiates a group of tasks
   */
  const tasks = (tasksOptions?: Partial<TaskManagerOptions>) => {
    const manager = new TaskManager({ raw: normalizedOptions.raw, ...tasksOptions })
    manager.useRenderer(renderer)
    manager.useColors(colors)
    return manager
  }

  /**
   * Instantiate a new table
   */
  const table = (tableOptions?: Partial<TableOptions>) => {
    const tableInstance = new Table({ raw: normalizedOptions.raw, ...tableOptions })
    tableInstance.useRenderer(renderer)
    tableInstance.useColors(colors)
    return tableInstance
  }

  return {
    colors,
    logger,
    table,
    tasks,
    icons,
    sticker,
    instructions,
  }
}
