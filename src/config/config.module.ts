import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(),
    },
  ],
  exports: [ConfigService], // Ekspor layanan konfigurasi agar dapat digunakan di modul lain
})
export class ConfigModule {}
