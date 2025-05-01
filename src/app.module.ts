import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { ClimateModule } from './climate/climate.module';
import { MqttModule } from './mqtt/mqtt.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Modul konfigurasi untuk mengelola variabel lingkungan
    ConfigModule,

    // Modul database untuk koneksi ke PostgreSQL
    DatabaseModule,

    // Modul climate untuk pengelolaan data iklim
    ClimateModule,

    // Modul MQTT untuk koneksi dan pengelolaan pesan MQTT
    MqttModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
