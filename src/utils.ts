/*
 * @poppinss/utils
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export function createWordWrapper(start: number, stop: number) {
  const mode = 'soft' as 'hard' | 'soft'
  const re = mode === 'hard' ? /\b/ : /(\S+\s+)/

  return function (text: string) {
    const chunks = text
      .toString()
      .split(re)
      .reduce<string[]>(function (acc, x) {
        if (mode === 'hard') {
          for (let i = 0; i < x.length; i += stop - start) {
            acc.push(x.slice(i, i + stop - start))
          }
        } else {
          acc.push(x)
        }
        return acc
      }, [])

    return chunks
      .reduce(
        function (lines, rawChunk) {
          if (rawChunk === '') {
            return lines
          }

          const chunk = rawChunk.replace(/\t/g, '    ')
          const i = lines.length - 1

          if (lines[i].length + chunk.length > stop) {
            lines[i] = lines[i].replace(/\s+$/, '')
            chunk.split(/\n/).forEach(function (c) {
              lines.push(new Array(start + 1).join(' ') + c.replace(/^\s+/, ''))
            })
          } else if (chunk.match(/\n/)) {
            const xs = chunk.split(/\n/)
            lines[i] += xs.shift()
            xs.forEach(function (c) {
              lines.push(new Array(start + 1).join(' ') + c.replace(/^\s+/, ''))
            })
          } else {
            lines[i] += chunk
          }

          return lines
        },
        [new Array(start + 1).join(' ')]
      )
      .join('\n')
  }
}
