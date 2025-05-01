import { Module } from '@nestjs/common';
import { ClimateController } from './climate.controller';
import { ClimateService } from './climate.service';
import { DatabaseModule } from '../database/database.module'; // Import modul database jika diperlukan
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [DatabaseModule, ConfigModule], // Tambahkan modul database dan config module
  controllers: [ClimateController],
  providers: [ClimateService],
  exports: [ClimateService], // Ekspor layanan jika diperlukan di modul lain
})
export class ClimateModule {}
