/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import CliTable from 'cli-table3'
import { getBest } from '../Colors'
import { ConsoleRenderer } from '../Renderer/Console'
import { RendererContract, TableOptions } from '../Contracts'

/**
 * Default config options
 */
const DEFAULTS: TableOptions = {
  colors: true,
}

/**
 * Exposes the API to represent a table
 */
export class Table {
  private state: {
    colWidths?: number[]
    head: string[]
    rows: string[][]
  } = {
    head: [],
    rows: [],
  }

  /**
   * The renderer to use to output logs
   */
  private renderer?: RendererContract

  /**
   * Logger configuration options
   */
  public options: TableOptions

  /**
   * The colors reference
   */
  public colors: ReturnType<typeof getBest>

  constructor(options?: Partial<TableOptions>, private testing: boolean = false) {
    this.options = { ...DEFAULTS, ...options }
    this.colors = getBest(this.testing, this.options.colors)
  }

  /**
   * Returns the renderer for rendering the messages
   */
  private getRenderer() {
    if (!this.renderer) {
      this.renderer = new ConsoleRenderer()
    }
    return this.renderer
  }

  /**
   * Define a custom renderer. Logs to "stdout" and "stderr"
   * by default
   */
  public useRenderer(renderer: RendererContract): this {
    this.renderer = renderer
    return this
  }

  /**
   * Define table head
   */
  public head(headColumns: string[]): this {
    this.state.head = headColumns.map((col) => this.colors.cyan(col))
    return this
  }

  /**
   * Add a new table row
   */
  public row(row: string[]): this {
    this.state.rows.push(row)
    return this
  }

  /**
   * Define custom column widths
   */
  public columnWidths(widths: number[]): this {
    this.state.colWidths = widths
    return this
  }

  /**
   * Render table
   */
  public render() {
    if (this.testing) {
      this.getRenderer().log(this.state.head.join('|'))
      this.state.rows.forEach((row) => this.getRenderer().log(row.join('|')))
      return
    }

    const cliTable = new CliTable({
      head: this.state.head,
      style: { head: [], border: ['dim'] },
      ...(this.state.colWidths ? { colWidths: this.state.colWidths } : {}),
    })
    this.state.rows.forEach((row) => cliTable.push(row))
    this.getRenderer().log(cliTable.toString())
  }
}
