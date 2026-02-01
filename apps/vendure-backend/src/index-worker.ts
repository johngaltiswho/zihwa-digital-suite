import crypto from 'node:crypto';

if (typeof global.crypto === 'undefined') {
  // @ts-ignore
  global.crypto = crypto;
}
import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

bootstrapWorker(config)
    .then(worker => worker.startJobQueue())
    .catch(err => {
        console.log(err);
    });
