/*
 * @poppinss/cliui
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { justify, truncate, wrap } from '../src/helpers.js'

test.group('Helpers | justify', () => {
  test('justify a string by adding space to the end of it', ({ assert }) => {
    const maxWidth = 20
    const justifiedColumns = justify(['help', 'serve', 'make:controller'], { maxWidth })

    assert.deepEqual(justifiedColumns, [
      'help                ',
      'serve               ',
      'make:controller     ',
    ])
  })

  test('justify and right align', ({ assert }) => {
    const maxWidth = 20
    const justifiedColumns = justify(['help', 'serve', 'make:controller'], {
      maxWidth,
      align: 'right',
    })

    assert.deepEqual(justifiedColumns, [
      '                help',
      '               serve',
      '     make:controller',
    ])
  })

  test('use custom padding char', ({ assert }) => {
    const maxWidth = 20
    const justifiedColumns = justify(['help', 'serve', 'make:controller'], {
      maxWidth,
      align: 'right',
      paddingChar: '.',
    })

    assert.deepEqual(justifiedColumns, [
      '................help',
      '...............serve',
      '.....make:controller',
    ])
  })

  test('do not add padding when column size is already same as the maxWidth', ({ assert }) => {
    const maxWidth = 15
    const justifiedColumns = justify(['help', 'serve', 'make:controller'], {
      maxWidth,
      align: 'right',
    })

    assert.deepEqual(justifiedColumns, ['           help', '          serve', 'make:controller'])
  })
})

test.group('Helpers | wrap', () => {
  test('wrap a string value within start and end column', ({ assert }) => {
    const wrappedColumns = wrap(
      [
        'Wrap the text under the starting and the ending column. The first line will start at 1st column',
        'However, from the 2nd line onwards, the columns before the start column are filled with white space.',
        'Trim the text after a certain width',
      ],
      {
        startColumn: 2,
        trimStart: true,
        endColumn: 40,
      }
    )

    assert.deepEqual(wrappedColumns, [
      [
        'Wrap the text under the starting and',
        '  the ending column. The first line',
        '  will start at 1st column',
      ].join('\n'),
      [
        'However, from the 2nd line onwards,',
        '  the columns before the start column',
        '  are filled with white space.',
      ].join('\n'),
      'Trim the text after a certain width',
    ])
  })

  test('do not trim starting padding', ({ assert }) => {
    const wrappedColumns = wrap(
      [
        'Wrap the text under the starting and the ending column. The first line will start at 1st column',
        'However, from the 2nd line onwards, the columns before the start column are filled with white space.',
        'Trim the text after a certain width',
      ],
      {
        startColumn: 2,
        endColumn: 40,
        trimStart: false,
      }
    )

    assert.deepEqual(wrappedColumns, [
      [
        '  Wrap the text under the starting and',
        '  the ending column. The first line',
        '  will start at 1st column',
      ].join('\n'),
      [
        '  However, from the 2nd line onwards,',
        '  the columns before the start column',
        '  are filled with white space.',
      ].join('\n'),
      '  Trim the text after a certain width',
    ])
  })
})

test.group('Helpers | truncate', () => {
  test('trim value after a certain length', ({ assert }) => {
    const trimmedColumns = truncate(
      [
        'Wrap the text under the starting and the ending column.',
        'However, from the 2nd line onwards, the columns',
        'Trim the text',
      ],
      {
        maxWidth: 20,
      }
    )

    assert.deepEqual(trimmedColumns, [
      'Wrap the text under…',
      'However, from the 2…',
      'Trim the text',
    ])
  })

  test('trim value from the start', ({ assert }) => {
    const trimmedColumns = truncate(
      [
        'Wrap the text under the starting and the ending column.',
        'However, from the 2nd line onwards, the columns',
        'Trim the text',
      ],
      {
        maxWidth: 20,
        position: 'start',
      }
    )

    assert.deepEqual(trimmedColumns, [
      '… the ending column.',
      '…nwards, the columns',
      'Trim the text',
    ])
  })

  test('use a custom truncation character', ({ assert }) => {
    const trimmedColumns = truncate(
      [
        'Wrap the text under the starting and the ending column.',
        'However, from the 2nd line onwards, the columns',
        'Trim the text',
      ],
      {
        maxWidth: 20,
        position: 'start',
        truncationChar: '...',
      }
    )

    assert.deepEqual(trimmedColumns, [
      '...he ending column.',
      '...ards, the columns',
      'Trim the text',
    ])
  })
})
