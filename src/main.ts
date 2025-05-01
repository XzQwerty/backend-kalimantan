import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import cors = require('cors');

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Buat instance aplikasi Nest.js
  const app = await NestFactory.create(AppModule);

  // Dapatkan layanan konfigurasi
  const configService = app.get(ConfigService);

  // Aktifkan CORS
  app.use(cors());

  // Dapatkan port dari variabel lingkungan atau gunakan default 3000
  const port = configService.getNumber('PORT', 3000);

  // Mulai server
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
}

// Jalankan aplikasi
bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error(`Error starting application: ${err.message}`, err.stack);
  process.exit(1);
});
