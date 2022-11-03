import cliui from '../index.js'
const ui = cliui()

const tasks = ui.tasks()

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(resolve, time))

await tasks
  .add('clone repo', async (task) => {
    await sleep(200)
    task.update(`cloning repo ${ui.colors.cyan('https://github.com/adonisjs/core')}`)

    await sleep(200)
    task.update(`downloaded ${ui.colors.cyan('10%')}`)

    await sleep(200)
    task.update(`downloaded ${ui.colors.cyan('20%')}`)

    await sleep(200)
    task.update(`downloaded ${ui.colors.cyan('30%')}`)

    await sleep(200)
    task.update(`downloaded ${ui.colors.cyan('40%')}`)

    await sleep(500)
    task.update(`downloaded ${ui.colors.cyan('80%')}`)

    await sleep(200)
    task.update(`downloaded ${ui.colors.cyan('90%')}`)
    return ui.logger.action('Download').prepareSucceeded('Completed succesfully')
  })
  .add('update package file', async (task) => {
    await sleep(200)
    task.update(ui.logger.action('update').prepareSucceeded('package.json'))
    await sleep(500)
    return 'Updated'
  })
  .add('install dependencies', async (task) => {
    await sleep(200)
    const spinner = ui.logger.await('installing')
    spinner.tap((line) => task.update(line))
    spinner.start()
    await sleep(1000)

    spinner.update('updating')

    await sleep(3000)
    spinner.stop()
    return new Error('ahuh')
  })
  .run()
