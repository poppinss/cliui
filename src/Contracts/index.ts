/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Logger } from '../Logger'

/**
 * Shape of the renderer contract. Except the spinner, every
 * interface accepts a renderer
 */
export interface RendererContract {
	log(message: string): void
	logError(message: string): void
	logUpdate(message: string): void
	logUpdateDone(): void
}

/**
 * Task update listener. Mainly used by the task renderers
 */
export type UpdateListener = (task: TaskContract) => void

/**
 * Shape of a task
 */
export interface TaskContract {
	title: string
	state: 'idle' | 'running' | 'failed' | 'succeeded'
	duration?: string
	completionMessage?: string | { message: string; stack?: string }
	start(): this
	onUpdate(callback: UpdateListener): this
	complete(message?: string): this
	fail(error: string | { message: string; stack?: string }): this
}

/**
 * Callback passed while registering task with the task
 * manager
 */
export type TaskCallback = (
	logger: Logger,
	task: {
		fail: (error: string | { message: string; stack?: string }) => Promise<void>
		complete: (message?: string) => Promise<void>
	}
) => void | Promise<void>

/**
 * Options accepted by the tasks renderers
 */
export type TaskRendererOptions = {
	colors: boolean
	interactive: boolean
}

/**
 * Options accepted by the tasks manager
 */
export type TaskManagerOptions = TaskRendererOptions & {
	verbose: boolean
}

/**
 * Logging types
 */
export type LoggingTypes = 'success' | 'error' | 'fatal' | 'warning' | 'info' | 'debug' | 'await'

/**
 * Options accepted by the logger
 */
export type LoggerOptions = {
	colors: boolean
	iconColors: boolean
	icons: boolean
	dim: boolean
	dimIcons: boolean
	interactive: boolean
}

/**
 * Options accepted by table
 */
export type TableOptions = {
	colors: boolean
}

/**
 * Options accepted by instructions
 */
export type InstructionsOptions = {
	icons: boolean
	colors: boolean
}

/**
 * Shape of the instructions line
 */
export type InstructionsLine = {
	text: string
	width: number
}
