import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { Pool } from 'pg';
import { ConfigService } from '../config/config.service';
import { DatabaseService } from '../database/database.service';
import { MicroclimatePayload, DhtPayload } from './mqtt.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class MqttService implements OnModuleInit {
  private readonly logger = new Logger(MqttService.name);
  private client!: mqtt.MqttClient;
  private db: Pool;

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    this.db = this.databaseService.getPool();
  }

  onModuleInit() {
    this.initializeMqttConnection();
  }

  connectToMqttBroker(): mqtt.MqttClient {
    const mqttOptions: mqtt.IClientOptions = {
      host: this.configService.get('MQTT_HOST'),
      port: parseInt(this.configService.get('MQTT_PORT'), 10),
      username: this.configService.get('MQTT_USERNAME'),
      password: this.configService.get('MQTT_PASSWORD'),
      clientId: `mqtt_client_${Math.random().toString(16).slice(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    };

    return mqtt.connect(mqttOptions);
  }

  private initializeMqttConnection() {
    this.client = this.connectToMqttBroker();

    this.client.on('connect', () => {
      this.logger.log('Connected to MQTT broker');

      this.client.subscribe('climate/kalimantan', (err) => {
        if (err) {
          if (err instanceof Error) {
            this.logger.error(`Error subscribing to climate/kalimantan: ${err.message}`);
          } else {
            this.logger.error(`Error subscribing to climate/kalimantan: ${String(err)}`);
          }
        } else {
          this.logger.log('Subscribed to climate/kalimantan');
        }
      });

      this.client.subscribe('climate/dht_kalimantan', (err) => {
        if (err) {
          if (err instanceof Error) {
            this.logger.error(`Error subscribing to climate/dht_kalimantan: ${err.message}`);
          } else {
            this.logger.error(`Error subscribing to climate/dht_kalimantan: ${String(err)}`);
          }
        } else {
          this.logger.log('Subscribed to climate/dht_kalimantan');
        }
      });
    });

    this.client.on('message', (topic, message) => {
      this.handleMqttMessage(topic, message);
    });

    this.client.on('error', (error) => {
      if (error instanceof Error) {
        this.logger.error(`MQTT Error: ${error.message}`);
      } else {
        this.logger.error(`MQTT Error: ${String(error)}`);
      }
    });

    this.client.on('close', () => {
      this.logger.warn('MQTT connection closed');
    });

    this.client.on('reconnect', () => {
      this.logger.log('Reconnecting to MQTT broker');
    });
  }

  private async handleMqttMessage(topic: string, message: Buffer) {
    try {
      const messageStr = message.toString();
      this.logger.log(`Received message from topic ${topic}: ${messageStr}`);

      if (topic === 'climate/kalimantan') {
        await this.handleMicroclimateMessage(messageStr);
      } else if (topic === 'climate/dht_kalimantan') {
        await this.handleDhtMessage(messageStr);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error handling MQTT message: ${error.message}`);
      } else {
        this.logger.error(`Error handling MQTT message: ${String(error)}`);
      }
    }
  }

  private async handleMicroclimateMessage(message: string) {
    const payloadObj = JSON.parse(message);
    const payload = plainToInstance(MicroclimatePayload, payloadObj);
    const errors = await validate(payload);
    if (errors.length > 0) {
      this.logger.error(`Validation failed for microclimate message: ${JSON.stringify(errors)}`);
      return;
    }

    const dataArray = [
      payload.timestamp,
      payload.temperature,
      payload.humidity,
      payload.rainfall,
      payload.direction,
      payload.angle,
      payload.wind_speed,
      payload.pyrano,
    ];

    const insertQuery = `
      INSERT INTO microclimate_kalimantan 
      (timestamp, temperature, humidity, rainfall, direction, angle, wind_speed, pyrano) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    try {
      await this.db.query(insertQuery, dataArray);
      this.logger.debug('Microclimate data inserted into database');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error inserting microclimate data: ${error.message}`);
      } else {
        this.logger.error(`Error inserting microclimate data: ${String(error)}`);
      }
    }
  }

  private async handleDhtMessage(message: string) {
    const payloadObj = JSON.parse(message);
    const payload = plainToInstance(DhtPayload, payloadObj);
    const errors = await validate(payload);
    if (errors.length > 0) {
      this.logger.error(`Validation failed for DHT message: ${JSON.stringify(errors)}`);
      return;
    }

    const dataArray = [
      payload.timestamp,
      payload.hum_dht22 === 999 ? null : payload.hum_dht22,
      payload.temp_dht22 === 999 ? null : payload.temp_dht22,
    ];

    const insertQuery = `
      INSERT INTO dht_kalimantan 
      (timestamp, hum_dht22, temp_dht22) 
      VALUES ($1, $2, $3)
    `;

    try {
      await this.db.query(insertQuery, dataArray);
      this.logger.debug('DHT data inserted into database');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error inserting DHT data: ${error.message}`);
      } else {
        this.logger.error(`Error inserting DHT data: ${String(error)}`);
      }
    }
  }
}
