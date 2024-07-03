import {ApplicationConfig} from '@loopback/core';
import {AuditService} from './application';

const ARGV_INDEX = 2;
const PORT = 300;
/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? PORT),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[ARGV_INDEX] ?? './src/openapi.json';
  const app = new AuditService(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('Fail to export OpenAPI spec from the application.', err);
    process.exit(1);
  });
