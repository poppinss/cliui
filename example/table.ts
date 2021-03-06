import { table, logger } from '../index'

table()
  .head(['migration', 'status'])
  .row(['1590591892626_tenants.ts', logger.colors.green('completed')])
  .row(['1590595949171_entities.ts', logger.colors.green('completed')])
  .row(['1590848460221_entity_settings.ts', logger.colors.green('completed')])
  .row(['1591340552017_entity_tds_credentials.ts', logger.colors.green('completed')])
  .row(['1591340559270_entity_esic_credentials.ts', logger.colors.green('completed')])
  .row(['1591340566450_entity_epfo_credentials.ts', logger.colors.green('completed')])
  .row(['1592217725114_entity_job_titles.ts', logger.colors.green('completed')])
  .row(['1592217725115_employees.ts', logger.colors.green('completed')])
  .row(['1592218021413_employee_profiles.ts', logger.colors.green('completed')])
  .row(['1592726938920_employee_emails.ts', logger.colors.yellow('pending')])
  .row(['1592726949565_employee_phone_numbers.ts', logger.colors.yellow('pending')])
  .row(['1592728640792_employee_invites.ts', logger.colors.yellow('pending')])
  .render()
