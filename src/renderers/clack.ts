/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Writable } from 'node:stream'
import { stripVTControlCharacters } from 'node:util'

import { TERMINAL_SIZE } from '../helpers.js'

/**
 * Writable stream used to capture output from synchronous Clack helpers.
 */
class ClackCaptureStream extends Writable {
  columns = TERMINAL_SIZE
  output = ''

  _write(chunk: Buffer | string, _encoding: BufferEncoding, callback: (error?: Error) => void) {
    this.output += chunk.toString()
    callback()
  }
}

/**
 * Capture output from one of Clack's synchronous rendering helpers. CLIUI can
 * then pass the prepared string to its own renderer contract.
 */
export function captureClackOutput(
  render: (output: Writable) => void,
  options: { stripAnsi?: boolean } = {}
) {
  const output = new ClackCaptureStream()
  render(output)

  const value = options.stripAnsi ? stripVTControlCharacters(output.output) : output.output
  return value.endsWith('\n') ? value.slice(0, -1) : value
}
