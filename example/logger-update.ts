import { logger } from '../index'

const sleep = () => new Promise<void>((resolve) => setTimeout(resolve, 50))

async function run() {
  for (let i = 0; i <= 100; i = i + 2) {
    await sleep()
    logger.logUpdate(`downloading ${i}%`)
  }

  logger.logUpdatePersist()
}

run()
