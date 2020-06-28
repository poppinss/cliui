/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { platform } = process

export const icons =
	platform === 'win32'
		? {
				tick: '√',
				cross: '×',
				bullet: '*',
				nodejs: '♦',
				pointer: '>',
				info: 'i',
				warning: '‼',
		  }
		: {
				tick: '✔',
				cross: '✖',
				bullet: '●',
				nodejs: '⬢',
				pointer: '❯',
				info: 'ℹ',
				warning: '⚠',
		  }
