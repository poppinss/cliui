/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import supportsColor from 'supports-color'
import { Colors } from '@poppinss/colors/types'
import { default as poppinssColors } from '@poppinss/colors'

import { icons } from './src/icons.js'
import { Table } from './src/table.js'
import { useColors } from './src/colors.js'
import { Logger } from './src/logger/main.js'
import { Instructions } from './src/instructions.js'
import { TaskManager } from './src/tasks/manager.js'
import { MemoryRenderer } from './src/renderers/memory.js'
import { ConsoleRenderer } from './src/renderers/console.js'
import type { RendererContract, TableOptions, TaskManagerOptions } from './src/types.js'

export {
  icons,
  Table,
  Logger,
  TaskManager,
  Instructions,
  MemoryRenderer,
  ConsoleRenderer,
  poppinssColors as colors,
}

/**
 * Create a new CLI UI instance.
 *
 * - The "raw" mode is tailored for testing
 * - The "silent" mode should be used when the terminal does not support colors. We
 *   automatically perform the detection
 */
export function cliui(options: Partial<{ mode: 'raw' | 'silent' | 'normal' }> = {}) {
  let mode = options.mode

  /**
   * Use silent mode when not explicit mode is defined
   */
  if (!mode && !supportsColor.stdout) {
    mode = 'silent'
  }

  /**
   * Renderer to use
   */
  let renderer: RendererContract = mode === 'raw' ? new MemoryRenderer() : new ConsoleRenderer()

  /**
   * Colors instance in use
   */
  let colors = useColors({ silent: mode === 'silent', raw: mode === 'raw' })

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
    const instructionsInstance = new Instructions({ icons: true, raw: mode === 'raw' })
    instructionsInstance.useRenderer(renderer)
    instructionsInstance.useColors(colors)
    return instructionsInstance
  }

  /**
   * Similar to instructions. But without the `pointer` icon
   */
  const sticker = () => {
    const instructionsInstance = new Instructions({ icons: false, raw: mode === 'raw' })
    instructionsInstance.useRenderer(renderer)
    instructionsInstance.useColors(colors)
    return instructionsInstance
  }

  /**
   * Initiates a group of tasks
   */
  const tasks = (tasksOptions?: Partial<TaskManagerOptions>) => {
    const manager = new TaskManager({ raw: mode === 'raw', ...tasksOptions })
    manager.useRenderer(renderer)
    manager.useColors(colors)
    return manager
  }

  /**
   * Instantiate a new table
   */
  const table = (tableOptions?: Partial<TableOptions>) => {
    const tableInstance = new Table({ raw: mode === 'raw', ...tableOptions })
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
    switchMode(modeToUse: 'raw' | 'silent' | 'normal') {
      mode = modeToUse

      /**
       * Use memory renderer in raw mode, otherwise switch to
       * console renderer
       */
      if (mode === 'raw') {
        this.useRenderer(new MemoryRenderer())
      } else {
        this.useRenderer(new ConsoleRenderer())
      }

      this.useColors(useColors({ silent: mode === 'silent', raw: mode === 'raw' }))
    },
    useRenderer(rendererToUse: RendererContract) {
      renderer = rendererToUse
      logger.useRenderer(renderer)
    },
    useColors(colorsToUse: Colors) {
      colors = colorsToUse
      logger.useColors(colors)
      this.colors = colors
    },
  }
}
