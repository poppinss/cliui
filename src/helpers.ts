/*
 * @poppinss/utils
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import wordwrap from 'wordwrap'
import stringWidth from 'string-width'
import cliTruncate from 'cli-truncate'
import terminalSize from 'terminal-size'

/**
 * Total number of columns for the terminal
 */
export const TERMINAL_SIZE = terminalSize().columns

/**
 * Applies padding to the left or the right of the string by repeating
 * a given char.
 *
 * The method is not same as `padLeft` or `padRight` from JavaScript STD lib,
 * since it repeats a char regardless of the max width.
 */
function applyPadding(
  value: string,
  options: { paddingLeft?: number; paddingRight?: number; paddingChar: string }
) {
  if (options.paddingLeft) {
    value = `${options.paddingChar.repeat(options.paddingLeft)}${value}`
  }

  if (options.paddingRight) {
    value = `${value}${options.paddingChar.repeat(options.paddingRight)}`
  }

  return value
}

/**
 * Justify the columns to have the same width by filling
 * the empty slots with a padding char.
 *
 * Optionally, the column can be aligned left or right.
 */
export function justify(
  columns: string[],
  options: {
    maxWidth: number
    align?: 'left' | 'right'
    paddingChar?: string
  }
) {
  const normalizedOptions = {
    align: 'left' as const,
    paddingChar: ' ',
    ...options,
  }

  return columns.map((column) => {
    const columnWidth = stringWidth(column)

    /**
     * Column is already same or greater than the maxWidth
     */
    if (columnWidth >= normalizedOptions.maxWidth) {
      return column
    }

    /**
     * Fill empty space on the right
     */
    if (normalizedOptions.align === 'left') {
      return applyPadding(column, {
        paddingChar: normalizedOptions.paddingChar,
        paddingRight: normalizedOptions.maxWidth - columnWidth,
      })
    }

    /**
     * Fill empty space on the left
     */
    return applyPadding(column, {
      paddingChar: normalizedOptions.paddingChar,
      paddingLeft: normalizedOptions.maxWidth - columnWidth,
    })
  })
}

/**
 * Wrap the text under the starting and the ending column.
 * The first line will start at 1st column. However, from
 * the 2nd line onwards, the columns before the start
 * column are filled with white space.
 */
export function wrap(
  columns: string[],
  options: {
    startColumn: number
    endColumn: number
    trimStart?: boolean
  }
) {
  const wrapper = wordwrap(options.startColumn, options.endColumn)
  if (options.trimStart) {
    return columns.map((column) => wrapper(column).trimStart())
  }

  return columns.map((column) => wrapper(column))
}

/**
 * Truncates the text after a certain width.
 */
export function truncate(
  columns: string[],
  options: {
    maxWidth: number
    truncationChar?: string
    position?: 'start' | 'middle' | 'end'
  }
) {
  return columns.map((column) =>
    cliTruncate(column, options.maxWidth, {
      truncationCharacter: options.truncationChar || '…',
      position: options.position || 'end',
    })
  )
}
