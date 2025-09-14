import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
import { useAzureMonitor } from '@azure/monitor-opentelemetry';

// useAzureMonitor({
//   azureMonitorExporterOptions: {
//     connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
//   }
// });

async function bootstrap() {
  const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.simple(),
        ),
      }),
      new OpenTelemetryTransportV3(),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonLogger,
    }),
  });

  app.enableCors();

  await app.listen(4000);
}

bootstrap();