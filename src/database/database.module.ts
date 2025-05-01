import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule], // Import modul konfigurasi untuk mendapatkan variabel lingkungan
  providers: [DatabaseService],
  exports: [DatabaseService], // Ekspor layanan database agar dapat digunakan di modul lain
})
export class DatabaseModule {}
