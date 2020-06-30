/*
 * @poppinss/cliui
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Logger } from '../../Logger'
import { ConsoleRenderer } from '../../Renderer/Console'
import { TaskContract, TaskRendererOptions, RendererContract } from '../../Contracts'

/**
 * Verbose renderer shows a detailed output of the tasks and the
 * messages logged by a given task
 */
export class VerboseRenderer {
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
	 * Prefixes pipe to a line of text
	 */
	private prefixPipe(text: string) {
		return text
			.split('\n')
			.map((line) => `${this.logger.colors.dim('│')}  ${line}`)
			.join('\n')
	}

	/**
	 * Instantiates the logger and defines a custom renderer
	 * to log messages in context with the currently running
	 * task
	 */
	private instantiateLogger() {
		this.logger = new Logger({ ...this.options, dim: true }, this.testing)

		this.logger.useRenderer({
			log: (message: string) => this.getRenderer().log(this.prefixPipe(message)),
			logError: (message: string) => this.getRenderer().logError(this.prefixPipe(message)),
			logUpdate: (message: string) => this.getRenderer().logUpdate(this.prefixPipe(message)),
			logUpdateDone: () => this.getRenderer().logUpdateDone(),
		})
	}

	/**
	 * Logs message based upon the state of the task
	 */
	private updateTask(task: TaskContract) {
		/**
		 * Task started running
		 */
		if (task.state === 'running') {
			this.getRenderer().log(`${this.logger.colors.dim('┌')} ${task.title}`)
			return
		}

		const pipe = this.logger.colors.dim('└')
		const duration = this.logger.colors.dim(`(${task.duration})`)

		/**
		 * Task failed
		 */
		if (task.state === 'failed') {
			task.completionMessage && this.logger.fatal(task.completionMessage)
			this.getRenderer().log(`${pipe} ${this.logger.colors.red('failed')} ${duration}`)
			return
		}

		/**
		 * Task succeeded
		 */
		if (task.state === 'succeeded') {
			task.completionMessage && this.logger.colors.green(task.completionMessage as string)
			this.getRenderer().log(`${pipe} ${this.logger.colors.green('completed')} ${duration}`)
			return
		}
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
		this.registeredTasks.forEach((task) => task.onUpdate(($task) => this.updateTask($task)))
	}
}
