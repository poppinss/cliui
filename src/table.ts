/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import CliTable from 'cli-table3'
import stringWidth from 'string-width'
import type { Colors } from '@poppinss/colors/types'

import { useColors } from './colors.js'
import { ConsoleRenderer } from './renderers/console.js'
import type { RendererContract, TableHead, TableOptions, TableRow } from './types.js'

/**
 * Exposes the API to represent a table
 */
export class Table {
  #state: {
    colWidths?: number[]
    head: TableHead
    rows: TableRow[]
  } = {
    head: [],
    rows: [],
  }

  /**
   * Size of the largest row for a given
   * column
   */
  #columnSizes: number[] = []

  /**
   * The renderer to use to output logs
   */
  #renderer?: RendererContract

  /**
   * Logger configuration options
   */
  #options: TableOptions

  /**
   * The colors reference
   */
  #colors?: Colors

  /**
   * Whether or not to render full width
   */
  #renderFullWidth: boolean = false

  /**
   * The column index that should take remaining
   * width.
   */
  #fluidColumnIndex: number = 0

  /**
   * Padding for columns
   */
  #padding: number = 2

  constructor(options: Partial<TableOptions> = {}) {
    this.#options = {
      raw: options.raw === undefined ? false : options.raw,
      chars: options.chars,
    }
  }

  /**
   * Tracking the column size and keeping on the largest
   * one by tracking the content size
   */
  #storeColumnSize(columns: string[]) {
    columns.forEach((column, index) => {
      const size = stringWidth(column)
      const existingSize = this.#columnSizes[index]
      if (!existingSize || existingSize < size) {
        this.#columnSizes[index] = size
      }
    })
  }

  /**
   * Computes the col widths based when in fullwidth mode
   */
  #computeColumnsWidth() {
    /**
     * Do not compute columns size, when rendering in full-width
     */
    if (!this.#renderFullWidth) {
      return
    }

    /**
     * The terminal columns
     */
    let columns = process.stdout.columns - (this.#columnSizes.length + 1)

    this.#state.colWidths = this.#state.colWidths || []
    this.#columnSizes.forEach((column, index) => {
      /**
       * The column width will be the size of the biggest
       * text + padding left + padding right
       */
      this.#state.colWidths![index] = this.#state.colWidths![index] || column + this.#padding * 2

      /**
       * Compute remaining columns
       */
      columns = columns - this.#state.colWidths![index]
    })

    /**
     * If there are remaining columns, then assign them
     * to the fluid column.
     */
    if (columns) {
      const index =
        this.#fluidColumnIndex > this.#columnSizes.length - 1 ? 0 : this.#fluidColumnIndex
      this.#state.colWidths![index] = this.#state.colWidths![index] + columns
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
   * Define table head
   */
  head(headColumns: TableHead): this {
    this.#state.head = headColumns
    this.#storeColumnSize(
      headColumns.map((column) => (typeof column === 'string' ? column : column.content))
    )
    return this
  }

  /**
   * Add a new table row
   */
  row(row: TableRow): this {
    this.#state.rows.push(row)

    if (Array.isArray(row)) {
      this.#storeColumnSize(row.map((cell) => (typeof cell === 'string' ? cell : cell.content)))
    }

    return this
  }

  /**
   * Define custom column widths
   */
  columnWidths(widths: number[]): this {
    this.#state.colWidths = widths
    return this
  }

  /**
   * Toggle whether or render in full width or not
   */
  fullWidth(renderFullWidth: boolean = true): this {
    this.#renderFullWidth = renderFullWidth
    return this
  }

  /**
   * Define the column index that should take
   * will remaining width when rendering in
   * full-width
   */
  fluidColumnIndex(index: number): this {
    this.#fluidColumnIndex = index
    return this
  }

  /**
   * Render table
   */
  render() {
    if (this.#options.raw) {
      this.getRenderer().log(
        this.#state.head.map((col) => (typeof col === 'string' ? col : col.content)).join('|')
      )

      this.#state.rows.forEach((row) => {
        const content = Array.isArray(row)
          ? row.map((cell) => (typeof cell === 'string' ? cell : cell.content))
          : Object.keys(row)

        this.getRenderer().log(content.join('|'))
      })

      return
    }

    this.#computeColumnsWidth()

    /**
     * Types of "cli-table3" are out of the sync from the
     * implementation
     */
    const cliTable = new CliTable({
      head: this.#state.head,
      style: { 'head': [], 'border': ['dim'], 'padding-left': 2, 'padding-right': 2 },
      wordWrap: true,
      ...(this.#state.colWidths ? { colWidths: this.#state.colWidths } : {}),
      chars: this.#options.chars,
    } as any)

    this.#state.rows.forEach((row) => cliTable.push(row))
    this.getRenderer().log(cliTable.toString())
  }
}
