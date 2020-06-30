/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { icons } from '../../Icons'
import { Logger } from '../../Logger'
import { ConsoleRenderer } from '../../Renderer/Console'
import { TaskContract, TaskRendererOptions, RendererContract } from '../../Contracts'

/**
 * As the name suggests, render tasks in minimal UI for better viewing
 * experience.
 */
export class MinimalRenderer {
	/**
	 * The renderer to use to output logs
	 */
	private renderer?: RendererContract

	/**
	 * List of registered tasks
	 */
	private registeredTasks: TaskContract[]

	/**
	 * Reference to the logger. We will capture logger messages
	 * and show them next to the task
	 */
	public logger: Logger

	constructor(private options: TaskRendererOptions, private testing: boolean = false) {}

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
	 * Instantiates the logger and defines a custom renderer
	 * to log messages in context with the currently running
	 * task
	 */
	private instantiateLogger() {
		/**
		 * The minimal renderer must always be used when term
		 * has support for colors and is tty
		 */
		this.logger = new Logger({ ...this.options, dim: true }, this.testing)

		this.logger.useRenderer({
			log: (message: string) => this.renderTasks(message),
			logError: (message: string) => this.renderTasks(message),
			logUpdate: (message: string) => this.renderTasks(message),
			logUpdateDone: () => {},
		})
	}

	/**
	 * Returns the presentation string for an idle task
	 */
	private presentIdleTask(task: TaskContract) {
		return `${this.logger.colors.dim(icons.pointer)} ${this.logger.colors.dim(task.title)}`
	}

	/**
	 * Returns the presentation string for a running task. The log line is
	 * updated when logger recieves the message.
	 */
	private presentRunningTask(task: TaskContract, logLine?: string) {
		let message = `${icons.pointer} ${task.title}`
		message = logLine ? `${message}\n  ${logLine}` : message
		return message
	}

	/**
	 * Returns the presentation string for a failed task
	 */
	private presentFailedTask(task: TaskContract) {
		const pointer = this.logger.colors.red(icons.pointer)
		const duration = this.logger.colors.dim(task.duration!)

		let message = `${pointer} ${task.title} ${duration}`
		if (!task.completionMessage) {
			return message
		}

		const errorMessage =
			typeof task.completionMessage === 'string' ? task.completionMessage : task.completionMessage.message

		message = `${message}\n  ${this.logger.colors.red(errorMessage)}`
		return message
	}

	/**
	 * Returns the presentation string for a succeeded task
	 */
	private presentSucceededTask(task: TaskContract) {
		const pointer = this.logger.colors.green(icons.pointer)
		const duration = this.logger.colors.dim(task.duration!)

		let message = `${pointer} ${task.title} ${duration}`
		if (!task.completionMessage) {
			return message
		}

		message = `${message}\n  ${this.logger.colors.dim(task.completionMessage as string)}`
		return message
	}

	/**
	 * Renders a given task
	 */
	private renderTask(task: TaskContract, logLine?: string): string {
		switch (task.state) {
			case 'idle':
				return this.presentIdleTask(task)
			case 'running':
				return this.presentRunningTask(task, logLine)
			case 'succeeded':
				return this.presentSucceededTask(task)
			case 'failed':
				return this.presentFailedTask(task)
		}
	}

	/**
	 * Re-renders all tasks by inspecting their current state
	 */
	private renderTasks(logLine?: string) {
		this.getRenderer().logUpdate(this.registeredTasks.map((task) => this.renderTask(task, logLine)).join('\n'))
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
	 * Register tasks to render
	 */
	public tasks(tasks: TaskContract[]): this {
		this.registeredTasks = tasks
		return this
	}

	/**
	 * Render all tasks
	 */
	public render() {
		this.instantiateLogger()
		this.registeredTasks.forEach((task) => task.onUpdate(() => this.renderTasks()))
		this.renderTasks()
	}
}
