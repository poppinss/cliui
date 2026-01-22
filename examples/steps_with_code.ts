import { cliui } from '../index.js'

const ui = cliui()

/**
 * Example: Display steps for setting up AdonisJS routes
 */
console.log('Setting up AdonisJS application:\n')

const steps = ui.steps()

steps.add(
  'Create a new controller',
  `Run the following command:\n${ui.colors.gray('node ace make:controller User')}`
)

steps.add(
  'Add routes to your application',
  `${ui.colors.dim('File:')} ${ui.colors.cyan('start/routes.ts')}\n` +
    `${ui.colors.dim('Add these routes at the end of the file:')}\n\n` +
    ui.colors.yellow("router.get('/users', 'UsersController.index')\n") +
    ui.colors.yellow("router.post('/users', 'UsersController.store')\n") +
    ui.colors.yellow("router.get('/users/:id', 'UsersController.show')\n") +
    ui.colors.yellow("router.put('/users/:id', 'UsersController.update')\n") +
    ui.colors.yellow("router.delete('/users/:id', 'UsersController.destroy')")
)

steps.add(
  'Configure database connection',
  `${ui.colors.dim('File:')} ${ui.colors.cyan('.env')}\n` +
    `${ui.colors.dim('Update your database credentials:')}\n\n` +
    ui.colors.green('DB_CONNECTION=pg\n') +
    ui.colors.green('DB_HOST=127.0.0.1\n') +
    ui.colors.green('DB_PORT=5432\n') +
    ui.colors.green('DB_USER=your_username\n') +
    ui.colors.green('DB_PASSWORD=your_password\n') +
    ui.colors.green('DB_DATABASE=your_database')
)

steps.add(
  'Run migrations',
  `Execute the migration command:\n${ui.colors.green('node ace migration:run')}`
)

steps.add('Start the development server', ui.colors.green('node ace serve --watch'))

steps.render()

console.log('\n')

/**
 * Example: Display steps for adding authentication
 */
console.log('Adding authentication to your app:\n')

const authSteps = ui.steps()

authSteps.add('Install auth package', ui.colors.gray('npm install @adonisjs/auth'))

authSteps.add(
  'Configure auth guards',
  `${ui.colors.dim('File:')} ${ui.colors.cyan('config/auth.ts')}\n` +
    `${ui.colors.dim('Add the session guard configuration:')}\n\n` +
    ui.colors.gray('guards: {\n') +
    ui.colors.gray('  web: {\n') +
    ui.colors.gray("    driver: 'session',\n") +
    ui.colors.gray('    provider: {\n') +
    ui.colors.gray("      driver: 'lucid',\n") +
    ui.colors.gray("      model: () => import('App/Models/User')\n") +
    ui.colors.gray('    }\n') +
    ui.colors.gray('  }\n') +
    ui.colors.gray('}')
)

authSteps.add(
  'Protect your routes',
  `${ui.colors.dim('File:')} ${ui.colors.cyan('start/routes.ts')}\n` +
    `${ui.colors.dim('Wrap protected routes with auth middleware:')}\n\n` +
    ui.colors.gray('router.group(() => {\n') +
    ui.colors.gray("  router.get('/dashboard', 'DashboardController.index')\n") +
    ui.colors.gray("  router.get('/profile', 'ProfileController.show')\n") +
    ui.colors.gray("}).middleware('auth')")
)

authSteps.render()
