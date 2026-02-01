import crypto from 'node:crypto';

if (typeof global.crypto === 'undefined') {
  // @ts-ignore
  global.crypto = crypto;
}
import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

runMigrations(config)
    .then(() => bootstrap(config))
    .catch(err => {
        console.log(err);
    });
