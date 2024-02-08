// import stringWidth from 'string-width'
import { TERMINAL_SIZE, justify, wrap } from '../src/helpers.js'

const metrics = [
  {
    title: 'First contentful paint',
    timing: '2.7s',
  },
  {
    title: 'Largest contentful pain',
    timing: '3.2s',
  },
  {
    title: 'Speed index',
    timing: '2.7s',
  },
  {
    title: 'Initial server response was short',
    timing: 'Root document took 20ms',
  },
]

function renderList() {
  const titles = metrics.map(({ title }) => title)
  const timings = metrics.map(({ timing }) => timing)

  /**
   * Uncomment the following line if you do not want
   * to trim the timing column.
   */
  // const largestTiming = Math.max(...timings.map((timing) => stringWidth(timing)))
  const largestTiming = 10

  const justifiedTitles = justify(titles, {
    maxWidth: TERMINAL_SIZE - largestTiming,
    align: 'left',
  })
  const justifiedTimings = wrap(justify(timings, { maxWidth: largestTiming }), {
    startColumn: TERMINAL_SIZE - largestTiming,
    endColumn: TERMINAL_SIZE,
    trimStart: true,
  })

  justifiedTitles.forEach((title, index) => {
    console.log(`${title}${justifiedTimings[index]}`)
  })
}

renderList()
