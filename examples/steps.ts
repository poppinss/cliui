import { cliui } from '../index.js'

const ui = cliui()

/**
 * Basic steps example
 */
console.log('Basic steps:')
const basicSteps = ui.steps()
basicSteps.add('Install dependencies', 'Run npm install to get started')
basicSteps.add('Configure app', 'Create a .env file with your settings')
basicSteps.add('Start server', 'Use npm start to launch the application')
basicSteps.render()

console.log('\n')

/**
 * Steps with rich ANSI formatting
 */
console.log('Steps with rich formatting:')
const richSteps = ui.steps()
richSteps.add('Clone repository', ui.colors.dim('git clone https://github.com/example/repo.git'))
richSteps.add(
  'Install dependencies',
  `Run ${ui.colors.cyan('npm install')} or ${ui.colors.cyan('yarn install')}`
)
richSteps.add(
  'Configure environment',
  `Copy ${ui.colors.yellow('.env.example')} to ${ui.colors.yellow('.env')}\nUpdate API keys and credentials`
)
richSteps.add('Run migrations', ui.colors.dim('npm run migrate'))
richSteps.add('Start development server', ui.colors.green('npm run dev'))
richSteps.render()

console.log('\n')

/**
 * Steps without content (titles only)
 */
console.log('Title-only steps:')
const titleOnlySteps = ui.steps()
titleOnlySteps.add('Download files')
titleOnlySteps.add('Extract archive')
titleOnlySteps.add('Verify checksums')
titleOnlySteps.add('Complete installation')
titleOnlySteps.render()

console.log('\n')

/**
 * Mixed steps (some with content, some without)
 */
console.log('Mixed steps:')
const mixedSteps = ui.steps()
mixedSteps.add('Prepare workspace')
mixedSteps.add('Build project', 'This may take a few minutes...')
mixedSteps.add('Run tests')
mixedSteps.add(
  'Deploy',
  `Target: ${ui.colors.cyan('production')}\nRegion: ${ui.colors.cyan('us-east-1')}`
)
mixedSteps.render()
