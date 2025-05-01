import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import moment from 'moment';
import { ConfigService } from '../config/config.service';

@Injectable()
export class ClimateService {
  private db: Pool;

  constructor(private configService: ConfigService) {
    this.db = new Pool({
      host: this.configService.get('DB_HOST'),
      port: parseInt(this.configService.get('DB_PORT'), 10), // Konversi string ke number
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_CLIMATE'),
    });
  }

  async getDataTopic1() {
    const data = await this.db.query(
      `SELECT id, timestamp, temperature, humidity, rainfall, direction, angle, wind_speed, pyrano AS irradiation FROM microclimate_kalimantan ORDER BY timestamp DESC LIMIT 1`,
    );
    if (data && data.rowCount && data.rowCount > 0) {
      return {
        count: data.rowCount,
        result: data.rows.map((row) => ({
          timestamp: moment(row.timestamp).format('DD-MM-YY HH:mm:ss'),
          ...row,
        })),
      };
    }
    return null;
  }

  async getDataTopic2() {
    const data = await this.db.query(
      `SELECT id, timestamp, hum_dht22, temp_dht22 FROM dht_kalimantan WHERE hum_dht22 IS NOT NULL AND temp_dht22 IS NOT NULL ORDER BY timestamp DESC LIMIT 1`,
    );
    if (data && data.rowCount && data.rowCount > 0) {
      return {
        count: data.rowCount,
        result: data.rows.map((row) => ({
          timestamp: moment(row.timestamp).format('DD-MM-YY HH:mm:ss'),
          ...row,
        })),
      };
    }
    return null;
  }

  async TableDataTopic1() {
    const data = await this.db.query(
      `SELECT id, timestamp, temperature, humidity, rainfall, direction, angle, wind_speed, pyrano AS irradiation FROM microclimate_kalimantan ORDER BY timestamp DESC LIMIT 10`,
    );
    if (data && data.rowCount && data.rowCount > 0) {
      return {
        count: data.rowCount,
        result: data.rows.map((row) => ({
          timestamp: moment(row.timestamp).format('DD-MM-YY HH:mm:ss'),
          ...row,
        })),
      };
    }
    return null;
  }

  async TableDataTopic2() {
    const data = await this.db.query(
      `SELECT timestamp, hum_dht22, temp_dht22 FROM dht_kalimantan ORDER BY timestamp DESC LIMIT 100`,
    );
    if (data && data.rowCount && data.rowCount > 0) {
      return {
        count: data.rowCount,
        result: data.rows.map((row) => ({
          timestamp: moment(row.timestamp).format('DD-MM-YY HH:mm:ss'),
          ...row,
        })),
      };
    }
    return null;
  }

  async getDataForOneDayTopic1() {
    const query = `
      WITH interval_data AS (
        SELECT
          date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 5) || ' minutes')::interval AS interval_start,
          timestamp,
          temperature,
          humidity,
          rainfall,
          direction,
          angle,
          wind_speed,
          pyrano AS irradiation,
          ROW_NUMBER() OVER (PARTITION BY date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 5) || ' minutes')::interval ORDER BY timestamp DESC) AS rn
        FROM microclimate_kalimantan
        WHERE timestamp::date BETWEEN CURRENT_DATE - INTERVAL '1 days' AND CURRENT_DATE
      )
      SELECT
        interval_start,
        temperature,
        humidity,
        rainfall,
        direction,
        angle,
        wind_speed,
        irradiation
      FROM interval_data
      WHERE rn = 1
      ORDER BY interval_start DESC
    `;

    const data = await this.db.query(query);
    if (data && data.rowCount && data.rowCount > 0) {
      return {
        count: data.rowCount,
        result: data.rows.map((row) => ({
          timestamp: moment(row.interval_start).format('DD-MM-YY HH:mm:ss'),
          ...row,
        })),
      };
    }
    return null;
  }

  async getDataForOneDayTopic2() {
    const query = `
      WITH interval_data AS (
        SELECT
          date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 5) || ' minutes')::interval AS interval_start,
          timestamp,
          hum_dht22,
          temp_dht22,
          ROW_NUMBER() OVER (PARTITION BY date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 5) || ' minutes')::interval ORDER BY timestamp DESC) AS rn
        FROM dht_kalimantan
        WHERE timestamp::date BETWEEN CURRENT_DATE - INTERVAL '1 days' AND CURRENT_DATE
      )
      SELECT
        interval_start,
        hum_dht22,
        temp_dht22,
        timestamp
      FROM interval_data
      WHERE rn = 1
      ORDER BY interval_start DESC
    `;

    const data = await this.db.query(query);
    if (data && data.rowCount && data.rowCount > 0) {
      return {
        count: data.rowCount,
        result: data.rows.map((row) => ({
          timestamp: moment(row.interval_start ? row.interval_start : row.timestamp).format('DD-MM-YY HH:mm:ss'),
          ...row,
        })),
      };
    }
    return null;
  }

  async getDataForSevenDaysTopic1() {
    const query = `
      WITH interval_data AS (
        SELECT
          date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 30) || ' minutes')::interval AS interval_start,
          timestamp,
          temperature,
          humidity,
          rainfall,
          direction,
          angle,
          wind_speed,
          pyrano AS irradiation,
          ROW_NUMBER() OVER (PARTITION BY date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 30) || ' minutes'):: interval AS interval_start,
          timestamp,
          temperature,
          humidity,
          rainfall,
          direction,
          angle,
          wind_speed,
          pyrano AS irradiation,
          ROW_NUMBER() OVER (PARTITION BY date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 30) || ' minutes')::interval ORDER BY timestamp DESC) AS rn
        FROM microclimate_kalimantan
        WHERE timestamp::date BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE
      )
      SELECT
        interval_start,
        temperature,
        humidity,
        rainfall,
        direction,
        angle,
        wind_speed,
        irradiation
      FROM interval_data
      WHERE rn = 1
      ORDER BY interval_start DESC
    `;

    const data = await this.db.query(query);
    if (data && data.rowCount && data.rowCount > 0) {
      return {
        count: data.rowCount,
        result: data.rows.map((row) => ({
          timestamp: moment(row.interval_start).format('DD-MM-YY HH:mm:ss'),
          ...row,
        })),
      };
    }
    return null;
  }

  async getDataForSevenDaysTopic2() {
    const query = `
      WITH interval_data AS (
        SELECT
          date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 30) || ' minutes')::interval AS interval_start,
          timestamp,
          hum_dht22,
          temp_dht22,
          ROW_NUMBER() OVER (PARTITION BY date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 30) || ' minutes')::interval ORDER BY timestamp DESC) AS rn
        FROM dht_kalimantan
        WHERE timestamp::date BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE
      )
      SELECT
        interval_start,
        hum_dht22,
        temp_dht22,
        timestamp
      FROM interval_data
      WHERE rn = 1
      ORDER BY interval_start DESC
    `;

    const data = await this.db.query(query);
    if (data && data.rowCount && data.rowCount > 0) {
      return {
        count: data.rowCount,
        result: data.rows.map((row) => ({
          timestamp: moment(row.interval_start ? row.interval_start : row.timestamp).format('DD-MM-YY HH:mm:ss'),
          ...row,
        })),
      };
    }
    return null;
  }

  async getDataForOneMonthTopic1() {
    const query = `
      WITH interval_data AS (
        SELECT
          date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 60) || ' minutes')::interval AS interval_start,
          timestamp,
          temperature,
          humidity,
          rainfall,
          direction,
          angle,
          wind_speed,
          pyrano AS irradiation,
          ROW_NUMBER() OVER (PARTITION BY date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 60) || ' minutes')::interval ORDER BY timestamp DESC) AS rn
        FROM microclimate_kalimantan
        WHERE timestamp::date BETWEEN CURRENT_DATE - INTERVAL '30 days' AND CURRENT_DATE
      )
      SELECT
        interval_start,
        temperature,
        humidity,
        rainfall,
        direction,
        angle,
        wind_speed,
        irradiation
      FROM interval_data
      WHERE rn = 1
      ORDER BY interval_start DESC
    `;

    const data = await this.db.query(query);
    if (data && data.rowCount && data.rowCount > 0) {
      return {
        count: data.rowCount,
        result: data.rows.map((row) => ({
          timestamp: moment(row.interval_start).format('DD-MM-YY HH:mm:ss'),
          ...row,
        })),
      };
    }
    return null;
  }

  async getDataForOneMonthTopic2() {
    const query = `
      WITH interval_data AS (
        SELECT
          date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 60) || ' minutes')::interval AS interval_start,
          timestamp,
          hum_dht22,
          temp_dht22,
          ROW_NUMBER() OVER (PARTITION BY date_trunc('minute', timestamp) - ((date_part('minute', timestamp)::int % 60) || ' minutes')::interval ORDER BY timestamp DESC) AS rn
        FROM dht_kalimantan
        WHERE timestamp::date BETWEEN CURRENT_DATE - INTERVAL '30 days' AND CURRENT_DATE
      )
      SELECT
        interval_start,
        hum_dht22,
        temp_dht22,
        timestamp
      FROM interval_data
      WHERE rn = 1
      ORDER BY interval_start DESC
    `;

    const data = await this.db.query(query);
    if (data && data.rowCount && data.rowCount > 0) {
      return {
        count: data.rowCount,
        result: data.rows.map((row) => ({
          timestamp: moment(row.interval_start ? row.interval_start : row.timestamp).format('DD-MM-YY HH:mm:ss'),
          ...row,
        })),
      };
    }
    return null;
  }
}
