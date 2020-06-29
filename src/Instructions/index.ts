/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import boxes from 'cli-boxes'
import stringWidth from 'string-width'

import { icons } from '../Icons'
import { getBest } from '../Colors'
import { ConsoleRenderer } from '../Renderer/Console'
import { InstructionsLine, RendererContract } from '../Contracts'

const BOX = boxes.round

/**
 * The API to render instructions wrapped inside a box
 */
export class Instructions {
	private state: {
		heading?: string
		content: InstructionsLine[]
	} = {
		content: [],
	}

	/**
	 * Renderer to use for rendering instructions
	 */
	private renderer?: RendererContract

	/**
	 * Line of the widest line inside instructions content
	 */
	private widestLineLength = 0

	/**
	 * Number of white spaces on the left of the box
	 */
	private leftPadding = 4

	/**
	 * Number of white spaces on the right of the box
	 */
	private rightPadding = 8

	/**
	 * Number of empty lines at the top
	 */
	private paddingTop = 1

	/**
	 * Number of empty lines at the bottom
	 */
	private paddingBottom = 1

	/**
	 * Reference to the colors
	 */
	private colors = getBest(this.testing, true)

	constructor(private testing: boolean = false) {}

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
	 * Repeats text for given number of times
	 */
	private repeat (text: string, times: number) {
		return new Array(times + 1).join(text)
	}

	/**
	 * Adds dim transformation
	 */
	private dim (text: string): string {
		return this.colors.gray(text) as string
	}

	/**
	 * Wraps content inside the left and right vertical lines
	 */
	private wrapInVerticalLines (content: string, leftWhitespace: string, rightWhitespace: string) {
		return `${this.dim(BOX.vertical)}${leftWhitespace}${content}${rightWhitespace}${this.dim(BOX.vertical)}`
	}

	/**
	 * Returns the top line for the box
	 */
	private getTopLine(): string {
		const horizontalLength = this.widestLineLength + this.leftPadding + this.rightPadding
		const horizontalLine = this.repeat(this.dim(BOX.horizontal), horizontalLength)
		return `${this.dim(BOX.topLeft)}${horizontalLine}${this.dim(BOX.topRight)}`
	}

	/**
	 * Returns the bottom line for the box
	 */
	private getBottomLine(): string {
		const horizontalLength = this.widestLineLength + this.leftPadding + this.rightPadding
		const horizontalLine = this.repeat(this.dim(BOX.horizontal), horizontalLength)
		return `${this.dim(BOX.bottomLeft)}${horizontalLine}${this.dim(BOX.bottomRight)}`
	}

	/**
	 * Decorates the instruction line by wrapping it inside the box
	 * lines
	 */
	private getContentLine(line: InstructionsLine): string {
		const rightWhitespace = this.repeat(' ', (this.widestLineLength - line.width) + this.rightPadding)
		const leftWhitespace = this.repeat(' ', this.leftPadding)
		return this.wrapInVerticalLines(line.text, leftWhitespace, rightWhitespace)
	}

	/**
	 * Returns the heading line with the border bottom
	 */
	private getHeading (): string | undefined {
		if (!this.state.heading) {
			return
		}

		const width = stringWidth(this.state.heading)

		const horizontalLength = this.widestLineLength + this.leftPadding + this.rightPadding
		const horizontalLine = this.repeat(this.dim(boxes.single.horizontal), horizontalLength)
		const leftWhitespace = this.repeat(' ', this.leftPadding)
		const rightWhitespace = this.repeat(' ', (this.widestLineLength - width) + this.rightPadding)

		const headingContent = this.wrapInVerticalLines(this.state.heading, leftWhitespace, rightWhitespace)
		const headingLine = this.wrapInVerticalLines(horizontalLine, '', '')
		return `${headingContent}\n${headingLine}`
	}

	/**
	 * Returns node for a empty line
	 */
	private getEmptyLineNode () {
		return { text: '', width: 0 }
	}

	/**
	 * Returns instructions lines with the padding
	 */
	private getLinesWithPadding () {
		const top = new Array(this.paddingTop).fill('').map(this.getEmptyLineNode)
		const bottom = new Array(this.paddingBottom).fill('').map(this.getEmptyLineNode)
		return top.concat(this.state.content).concat(bottom)
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
	 * Define heading for instructions
	 */
	public heading(text: string): this {
		this.state.heading = text
		return this
	}

	/**
	 * Add new instruction. Each instruction is rendered
	 * in a new line inside a box
	 */
	public add(text: string): this {
		text
		text = `${this.dim(icons.pointer)} ${text}`

		const width = stringWidth(text)
		if (width > this.widestLineLength) {
			this.widestLineLength = width
		}

		this.state.content.push({ text, width })
		return this
	}

	/**
	 * Render instructions
	 */
	public render() {
		const renderer = this.getRenderer()

		/**
		 * Render content as it is in testing mode
		 */
		if (this.testing) {
			this.state.heading && renderer.log(this.state.heading)
			this.state.content.forEach(({ text }) => renderer.log(text))
			return
		}

		const top = this.getTopLine()
		const heading = this.getHeading()
		const body = this.getLinesWithPadding().map((line) => this.getContentLine(line)).join('\n')
		const bottom = this.getBottomLine()

		let output = `${top}\n`
		if (heading) {
			output = `${output}${heading}\n`
		}

		renderer.log(`${output}${body}\n${bottom}`)
	}
}