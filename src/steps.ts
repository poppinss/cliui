/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Colors } from '@poppinss/colors/types'
import { S_BAR, S_STEP_SUBMIT } from '@clack/prompts'

import { useColors } from './colors.js'
import { ConsoleRenderer } from './renderers/console.js'
import type { RendererContract, StepItem, StepsOptions } from './types.js'

/**
 * Steps class is used to display a series of sequential steps
 * with counters, titles, content, and a visual left border
 * connecting them.
 *
 * ```ts
 * const steps = ui.steps()
 *
 * steps.add('Install dependencies', 'Run npm install to get started')
 * steps.add('Configure app', 'Create a .env file with your settings')
 * steps.add('Start server', 'Use npm start to launch the application')
 *
 * steps.render()
 * ```
 */
export class Steps {
  /**
   * Collection of steps to display
   */
  #steps: StepItem[] = []

  /**
   * The renderer to use for rendering output
   */
  #renderer?: RendererContract

  /**
   * Colors instance for styling output
   */
  #colors?: Colors

  /**
   * Options for the steps
   */
  #options: StepsOptions

  constructor(options: Partial<StepsOptions> = {}) {
    this.#options = {
      raw: options.raw === undefined ? false : options.raw,
    }
  }

  /**
   * Returns the renderer to use for output.
   * Defaults to ConsoleRenderer if not explicitly set
   */
  getRenderer(): RendererContract {
    if (!this.#renderer) {
      this.#renderer = new ConsoleRenderer()
    }
    return this.#renderer
  }

  /**
   * Define a custom renderer to use
   */
  useRenderer(renderer: RendererContract): this {
    this.#renderer = renderer
    return this
  }

  /**
   * Returns the colors instance
   */
  getColors(): Colors {
    if (!this.#colors) {
      this.#colors = useColors()
    }
    return this.#colors
  }

  /**
   * Define a custom colors instance
   */
  useColors(colors: Colors): this {
    this.#colors = colors
    return this
  }

  /**
   * Add a new step to the collection
   *
   * @param title - The step title/heading
   * @param content - Optional content/description for the step (supports ANSI formatting)
   */
  add(title: string, content?: string): this {
    this.#steps.push({ title, content })
    return this
  }

  /**
   * Prepare the formatted output without rendering.
   * Useful for testing or custom output handling.
   */
  prepare(): string {
    const colors = this.getColors()
    const lines: string[] = []
    const stepCount = this.#steps.length

    this.#steps.forEach((step, index) => {
      const stepNumber = index + 1
      const isLast = stepNumber === stepCount
      const rail = colors.gray(S_BAR)

      // Clack's completed-step symbol and rail make the sequence explicit.
      const symbol = colors.green(S_STEP_SUBMIT)
      lines.push(`${symbol}  ${stepNumber}. ${step.title}`)

      // Step content (if provided)
      if (step.content) {
        const contentLines = step.content.split('\n')
        contentLines.forEach((line) => {
          if (this.#options.raw) {
            // In raw mode, no border or indentation for easier assertions
            lines.push(line)
          } else {
            // The rail visually owns content belonging to the current step.
            lines.push(`${rail}  ${line}`)
          }
        })
      }

      // Add connector to next step (unless it's the last step)
      // Skip in raw mode for easier assertions
      if (!isLast && !this.#options.raw) {
        lines.push(rail)
      }
    })

    return lines.join('\n')
  }

  /**
   * Render the steps to the configured renderer
   */
  render(): void {
    const output = this.prepare()
    this.getRenderer().log(output)
  }
}
