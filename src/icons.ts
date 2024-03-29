/*
 * @poppinss/utils
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { platform } = process

/**
 * A collection of platform specific icons
 */
export const icons =
  platform === 'win32' && !process.env.WT_SESSION
    ? {
        tick: '√',
        cross: '×',
        bullet: '*',
        nodejs: '♦',
        pointer: '>',
        info: 'i',
        warning: '‼',
        squareSmallFilled: '[█]',
      }
    : {
        tick: '✔',
        cross: '✖',
        bullet: '●',
        nodejs: '⬢',
        pointer: '❯',
        info: 'ℹ',
        warning: '⚠',
        squareSmallFilled: '◼',
      }
