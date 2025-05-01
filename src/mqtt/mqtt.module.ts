import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
  ],
  controllers: [MqttController],
  providers: [
    MqttService,
    {
      provide: 'MQTT_CLIENT',
      useFactory: (mqttService: MqttService) => {
        return mqttService.connectToMqttBroker();
      },
      inject: [MqttService],
    },
  ],
  exports: [MqttService],
})
export class MqttModule {}