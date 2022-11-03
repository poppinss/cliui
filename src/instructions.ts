/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import boxes from 'cli-boxes'
import stringWidth from 'string-width'
import type { Colors } from '@poppinss/colors/types'

import { icons } from './icons.js'
import { useColors } from './colors.js'
import { ConsoleRenderer } from './renderers/console.js'
import type { InstructionsOptions, RendererContract } from './types.js'

/**
 * The box styling used by the instructions
 */
const BOX = boxes.round

/**
 * The API to render instructions wrapped inside a box
 */
export class Instructions {
  #state: {
    heading?: { text: string; width: number }
    content: { text: string; width: number }[]
  } = {
    content: [],
  }

  /**
   * Renderer to use for rendering instructions
   */
  #renderer?: RendererContract

  /**
   * Length of the widest line inside instructions content
   */
  #widestLineLength = 0

  /**
   * Number of white spaces on the left of the box
   */
  #leftPadding = 4

  /**
   * Number of white spaces on the right of the box
   */
  #rightPadding = 8

  /**
   * Number of empty lines at the top
   */
  #paddingTop = 1

  /**
   * Number of empty lines at the bottom
   */
  #paddingBottom = 1

  /**
   * Reference to the colors
   */
  #colors?: Colors

  /**
   * Options
   */
  #options: InstructionsOptions

  #totalColumns = process.stdout.columns - 2

  #getHorizontalLength() {
    const length = this.#widestLineLength + this.#leftPadding + this.#rightPadding
    if (length > this.#totalColumns) {
      return this.#totalColumns
    }

    return length
  }

  constructor(options: Partial<InstructionsOptions> = {}) {
    this.#options = {
      icons: options.icons === undefined ? true : options.icons,
      raw: options.raw === undefined ? false : options.raw,
    }
  }

  /**
   * Repeats text for given number of times
   */
  #repeat(text: string, times: number) {
    return new Array(times + 1).join(text)
  }

  /**
   * Wraps content inside the left and right vertical lines
   */
  #wrapInVerticalLines(content: string, leftWhitespace: string, rightWhitespace: string) {
    return `${this.getColors().dim(
      BOX.left
    )}${leftWhitespace}${content}${rightWhitespace}${this.getColors().dim(BOX.right)}`
  }

  /**
   * Returns the top line for the box
   */
  #getTopLine(): string {
    const horizontalLength = this.#getHorizontalLength()
    const horizontalLine = this.#repeat(this.getColors().dim(BOX.top), horizontalLength)

    return `${this.getColors().dim(BOX.topLeft)}${horizontalLine}${this.getColors().dim(
      BOX.topRight
    )}`
  }

  /**
   * Returns the bottom line for the box
   */
  #getBottomLine(): string {
    const horizontalLength = this.#getHorizontalLength()
    const horizontalLine = this.#repeat(this.getColors().dim(BOX.bottom), horizontalLength)
    return `${this.getColors().dim(BOX.bottomLeft)}${horizontalLine}${this.getColors().dim(
      BOX.bottomRight
    )}`
  }

  /**
   * Decorates the instruction line by wrapping it inside the box
   * lines
   */
  #getContentLine(line: { text: string; width: number }): string {
    const rightWhitespace = this.#repeat(
      ' ',
      this.#widestLineLength - line.width + this.#rightPadding
    )
    const leftWhitespace = this.#repeat(' ', this.#leftPadding)
    return this.#wrapInVerticalLines(line.text, leftWhitespace, rightWhitespace)
  }

  /**
   * Returns the heading line with the border bottom
   */
  #getHeading(): string | undefined {
    if (!this.#state.heading) {
      return
    }

    /**
     * Creating the header text
     */
    const leftWhitespace = this.#repeat(' ', this.#leftPadding)
    const rightWhitespace = this.#repeat(
      ' ',
      this.#widestLineLength - this.#state.heading.width + this.#rightPadding
    )

    const headingContent = this.#wrapInVerticalLines(
      this.#state.heading.text,
      leftWhitespace,
      rightWhitespace
    )

    /**
     * Creating the heading border bottom
     */
    const horizontalLength = this.#widestLineLength + this.#leftPadding + this.#rightPadding
    const borderLine = this.#repeat(this.getColors().dim(boxes.single.top), horizontalLength)
    const border = this.#wrapInVerticalLines(borderLine, '', '')

    return `${headingContent}\n${border}`
  }

  /**
   * Returns node for a empty line
   */
  #getEmptyLineNode() {
    return { text: '', width: 0 }
  }

  /**
   * Returns instructions lines with the padding
   */
  #getLinesWithPadding() {
    const top = new Array(this.#paddingTop).fill('').map(this.#getEmptyLineNode)
    const bottom = new Array(this.#paddingBottom).fill('').map(this.#getEmptyLineNode)
    return top.concat(this.#state.content).concat(bottom)
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
   * Define heading for instructions
   */
  heading(text: string): this {
    const width = stringWidth(text)
    if (width > this.#widestLineLength) {
      this.#widestLineLength = width
    }

    this.#state.heading = { text, width }
    return this
  }

  /**
   * Add new instruction. Each instruction is rendered
   * in a new line inside a box
   */
  add(text: string): this {
    text = this.#options.icons ? `${this.getColors().dim(icons.pointer)} ${text}` : `${text}`

    const width = stringWidth(text)
    if (width > this.#widestLineLength) {
      this.#widestLineLength = width
    }

    this.#state.content.push({ text, width })
    return this
  }

  /**
   * Render instructions
   */
  render() {
    const renderer = this.getRenderer()

    /**
     * Render content as it is in raw mode
     */
    if (this.#options.raw) {
      this.#state.heading && renderer.log(this.#state.heading.text)
      this.#state.content.forEach(({ text }) => renderer.log(text))
      return
    }

    if (this.#widestLineLength > process.stdout.columns) {
      this.#widestLineLength = process.stdout.columns
    }

    const top = this.#getTopLine()
    const heading = this.#getHeading()
    const body = this.#getLinesWithPadding()
      .map((line) => this.#getContentLine(line))
      .join('\n')
    const bottom = this.#getBottomLine()

    let output = `${top}\n`
    if (heading) {
      output = `${output}${heading}\n`
    }

    renderer.log(`${output}${body}\n${bottom}`)
  }
}
