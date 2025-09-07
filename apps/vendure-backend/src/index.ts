import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

runMigrations(config)
    .then(() => bootstrap(config))
    .then((app) => {
        const server = app.getHttpServer();
        const address = server.address();
        const port = typeof address === 'string' ? address : address?.port;
        
        console.log('');
        console.log('🚀 Vendure Server is running!');
        console.log(`📋 Admin UI:    http://localhost:${port}/admin`);
        console.log(`🔗 GraphQL API: http://localhost:${port}/shop-api`);
        console.log(`👤 Login:       superadmin@vendure.io / superadmin`);
        console.log('');
        
        return app;
    })
    .catch(err => {
        console.error('❌ Failed to start Vendure:', err);
        process.exit(1);
    });
