import cliui from '../index.js'
const ui = cliui()

const table = ui.table()

console.log('')

table
  .head([
    ui.colors.dim('Migration'),
    { content: ui.colors.dim('Duration'), hAlign: 'right' },
    { content: ui.colors.dim('Status'), hAlign: 'right' },
  ])
  .row([
    ui.colors.reset('1590591892626_tenants.ts'),
    { content: `${ui.colors.dim('2ms')}`, hAlign: 'right' },
    { content: `${ui.colors.green('DONE')}`, hAlign: 'right' },
  ])
  .row([
    ui.colors.reset('1590595949171_entities.ts'),
    { content: `${ui.colors.dim('2ms')}`, hAlign: 'right' },
    { content: `${ui.colors.green('DONE')}`, hAlign: 'right' },
  ])
  .row([
    ui.colors.reset('1590848460221_entity_settings.ts'),
    { content: `${ui.colors.dim('2ms')}`, hAlign: 'right' },
    { content: `${ui.colors.green('DONE')}`, hAlign: 'right' },
  ])
  .row([
    ui.colors.reset('1591340566450_entity_epfo_credentials.ts'),
    { content: `${ui.colors.dim('2ms')}`, hAlign: 'right' },
    { content: `${ui.colors.green('DONE')}`, hAlign: 'right' },
  ])
  .row([
    ui.colors.reset('1592217725114_entity_job_titles.ts'),
    { content: `${ui.colors.dim('2ms')}`, hAlign: 'right' },
    { content: `${ui.colors.green('DONE')}`, hAlign: 'right' },
  ])
  .row([
    ui.colors.reset('1592217725115_employees.ts'),
    { content: `${ui.colors.dim('2ms')}`, hAlign: 'right' },
    { content: `${ui.colors.green('DONE')}`, hAlign: 'right' },
  ])
  .row([
    ui.colors.reset('1592218021413_employee_profiles.ts'),
    { content: `${ui.colors.dim('2ms')}`, hAlign: 'right' },
    { content: `${ui.colors.green('DONE')}`, hAlign: 'right' },
  ])
  .row([
    ui.colors.reset('1592726938920_employee_emails.ts'),
    '',
    { content: `${ui.colors.yellow('PENDING')}`, hAlign: 'right' },
  ])
  .row([
    ui.colors.reset('1592726949565_employee_phone_numbers.ts'),
    '',
    { content: `${ui.colors.yellow('PENDING')}`, hAlign: 'right' },
  ])
  .row([
    ui.colors.reset('1592728640792_employee_invites.ts'),
    '',
    { content: `${ui.colors.yellow('PENDING')}`, hAlign: 'right' },
  ])
  .fullWidth()
  .fluidColumnIndex(0)
  .render()
