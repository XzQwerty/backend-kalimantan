import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {
    // Inisialisasi pool koneksi database
    this.pool = new Pool({
      host: this.configService.get('DB_HOST'),
      port: parseInt(this.configService.get('DB_PORT')),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_CLIMATE'),
      max: 20, // Maksimum koneksi dalam pool
      idleTimeoutMillis: 30000, // Waktu idle sebelum koneksi ditutup
      connectionTimeoutMillis: 2000, // Waktu timeout untuk koneksi baru
    });
  }

  // Metode yang dipanggil saat modul diinisialisasi
  async onModuleInit() {
    try {
      // Tes koneksi database
      const client = await this.pool.connect();
      client.release();
      this.logger.log('Database connection established successfully');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to connect to database: ${error.message}`);
      } else {
        this.logger.error(`Failed to connect to database: ${String(error)}`);
      }
      throw error;
    }
  }

  // Metode yang dipanggil saat modul dihancurkan
  async onModuleDestroy() {
    try {
      await this.pool.end();
      this.logger.log('Database connection pool closed');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error closing database connection pool: ${error.message}`,
        );
      } else {
        this.logger.error(
          `Error closing database connection pool: ${String(error)}`,
        );
      }
    }
  }

  // Mendapatkan pool koneksi database
  getPool(): Pool {
    return this.pool;
  }

  // Mendapatkan klien dari pool
  async getClient(): Promise<PoolClient> {
    try {
      return await this.pool.connect();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error getting database client: ${error.message}`);
      } else {
        this.logger.error(`Error getting database client: ${String(error)}`);
      }
      throw error;
    }
  }

  // Metode untuk melakukan query dengan parameter
  async query(text: string, params: any[] = []): Promise<any> {
    const client = await this.getClient();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error executing query: ${error.message}`);
      } else {
        this.logger.error(`Error executing query: ${String(error)}`);
      }
      throw error;
    } finally {
      client.release();
    }
  }

  // Metode untuk melakukan transaksi
  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof Error) {
        this.logger.error(`Transaction failed: ${error.message}`);
      } else {
        this.logger.error(`Transaction failed: ${String(error)}`);
      }
      throw error;
    } finally {
      client.release();
    }
  }
}
