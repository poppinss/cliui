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

  /**
   * Draws the border
   */
  #drawBorder: (border: string, colors: Colors) => string = (border, colors) => {
    return colors.dim(border)
  }

  constructor(options: Partial<InstructionsOptions> = {}) {
    this.#options = {
      icons: options.icons === undefined ? true : options.icons,
      raw: options.raw === undefined ? false : options.raw,
    }
  }

  /**
   * Returns the length of the horizontal line
   */
  #getHorizontalLength() {
    return this.#widestLineLength + this.#leftPadding + this.#rightPadding
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
    return `${this.#drawBorder(
      BOX.left,
      this.getColors()
    )}${leftWhitespace}${content}${rightWhitespace}${this.#drawBorder(BOX.right, this.getColors())}`
  }

  /**
   * Returns the top line for the box
   */
  #getTopLine(): string {
    const horizontalLength = this.#getHorizontalLength()
    const horizontalLine = this.#repeat(
      this.#drawBorder(BOX.top, this.getColors()),
      horizontalLength
    )

    return `${this.#drawBorder(BOX.topLeft, this.getColors())}${horizontalLine}${this.#drawBorder(
      BOX.topRight,
      this.getColors()
    )}`
  }

  /**
   * Returns the bottom line for the box
   */
  #getBottomLine(): string {
    const horizontalLength = this.#getHorizontalLength()
    const horizontalLine = this.#repeat(
      this.#drawBorder(BOX.bottom, this.getColors()),
      horizontalLength
    )
    return `${this.#drawBorder(
      BOX.bottomLeft,
      this.getColors()
    )}${horizontalLine}${this.#drawBorder(BOX.bottomRight, this.getColors())}`
  }

  /**
   * Returns the heading border bottom
   */
  #getHeadingBorderBottom(): string {
    const horizontalLength = this.#getHorizontalLength()
    const horizontalLine = this.#repeat(
      this.#drawBorder(boxes.single.top, this.getColors()),
      horizontalLength
    )
    return this.#wrapInVerticalLines(horizontalLine, '', '')
  }

  /**
   * Decorates the instruction line by wrapping it inside the box
   * lines
   */
  #getContentLine(line: { text: string; width: number }): string {
    const leftWhitespace = this.#repeat(' ', this.#leftPadding)
    const rightWhitespace = this.#repeat(
      ' ',
      this.#widestLineLength - line.width + this.#rightPadding
    )
    return this.#wrapInVerticalLines(line.text, leftWhitespace, rightWhitespace)
  }

  /**
   * Returns the heading line by applying padding
   */
  #getHeading(): string | undefined {
    if (!this.#state.heading) {
      return
    }

    return this.#getContentLine(this.#state.heading)
  }

  /**
   * Returns the formatted body
   */
  #getBody(): string | undefined {
    if (!this.#state.content || !this.#state.content.length) {
      return
    }

    const top = new Array(this.#paddingTop).fill('').map(this.#getEmptyLineNode)
    const bottom = new Array(this.#paddingBottom).fill('').map(this.#getEmptyLineNode)

    return top
      .concat(this.#state.content)
      .concat(bottom)
      .map((line) => this.#getContentLine(line))
      .join('\n')
  }

  /**
   * Returns node for a empty line
   */
  #getEmptyLineNode() {
    return { text: '', width: 0 }
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
   * Draw the instructions box in fullscreen
   */
  fullScreen(): this {
    const borderWidth = 2
    this.#widestLineLength =
      process.stdout.columns - (this.#leftPadding + this.#rightPadding) - borderWidth

    return this
  }

  /**
   * Attach a callback to self draw the borders
   */
  drawBorder(callback: (borderChar: string, colors: Colors) => string) {
    this.#drawBorder = callback
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

    const top = this.#getTopLine()
    const heading = this.#getHeading()
    const headingBorderBottom = this.#getHeadingBorderBottom()
    const body = this.#getBody()
    const bottom = this.#getBottomLine()

    let output = `${top}\n`

    /**
     * Draw heading if it exists
     */
    if (heading) {
      output = `${output}${heading}`
    }

    /**
     * Draw the border between the heading and the body if
     * both exists
     */
    if (heading && body) {
      output = `${output}\n${headingBorderBottom}\n`
    }

    /**
     * Draw body if it exists
     */
    if (body) {
      output = `${output}${body}`
    }

    /**
     * Log the output with a bottom border
     */
    renderer.log(`${output}\n${bottom}`)
  }
}
