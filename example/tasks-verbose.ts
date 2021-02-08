import { tasks } from '../index'

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

tasks
  .verbose()
  .add('clone repo', async (logger, task) => {
    await sleep(200)
    logger.log(`cloning repo ${logger.colors.cyan('https://github.com/adonisjs/core')}`)

    await sleep(1000)
    logger.log(`downloaded ${logger.colors.cyan('10%')}`)

    await sleep(200)
    logger.log(`downloaded ${logger.colors.cyan('20%')}`)

    await sleep(200)
    logger.log(`downloaded ${logger.colors.cyan('30%')}`)

    await sleep(200)
    logger.log(`downloaded ${logger.colors.cyan('40%')}`)

    await sleep(500)
    logger.log(`downloaded ${logger.colors.cyan('80%')}`)

    await sleep(200)
    logger.log(`downloaded ${logger.colors.cyan('90%')}`)
    await task.complete()
  })
  .add('update package file', async (logger, task) => {
    await sleep(200)
    logger.action('update').succeeded('package.json')
    await sleep(500)
    await task.complete()
  })
  .add('install dependencies', async (logger, task) => {
    await sleep(200)
    const spinner = logger.await('installing')

    await sleep(3000)
    spinner.stop()
    await task.complete()
  })
  .run()
