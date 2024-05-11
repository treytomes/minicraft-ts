import convict from 'convict';
import { Environment } from '../models';

export const config = convict({
  environment: {
    doc: 'The type of execution environment.',
    format: Object.values(Environment).filter(value => typeof value === 'string'),
    default: Environment[Environment.dev],
    env: 'ENVIRONMENT',
  },
}).validate({ allowed: 'strict' });
