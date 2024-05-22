import convict from 'convict';
import {Environment} from '../../shared/models';

export const config = convict({
  debug: {
    doc: 'Is the app currently being debugged?',
    format: [true, false],
    default: false,
    env: 'DEBUG',
  },
  environment: {
    doc: 'The type of execution environment.',
    format: [Environment.dev, Environment.prd],
    default: Environment.dev,
    env: 'ENVIRONMENT',
  },
}).validate({allowed: 'strict'});
