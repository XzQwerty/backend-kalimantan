import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private readonly envConfig: Record<string, string>;

  constructor() {
    // Cari file .env di root proyek
    const envFilePath = path.resolve(process.cwd(), '.env');

    // Periksa apakah file .env ada
    const envFileExists = fs.existsSync(envFilePath);

    if (envFileExists) {
      this.logger.log(`Loading configuration from ${envFilePath}`);
      this.envConfig = dotenv.parse(fs.readFileSync(envFilePath));
    } else {
      this.logger.warn('.env file not found, using process.env');
      // Konversi process.env menjadi Record<string, string>
      this.envConfig = Object.keys(process.env).reduce((acc, key) => {
        acc[key] = process.env[key] || '';
        return acc;
      }, {} as Record<string, string>);
    }
  }

  /**
   * Mendapatkan nilai dari variabel lingkungan
   * @param key Nama variabel lingkungan
   * @param defaultValue Nilai default jika variabel tidak ditemukan
   * @returns Nilai variabel lingkungan
   */
  get(key: string, defaultValue: string = ''): string {
    const value = this.envConfig[key] || process.env[key] || defaultValue;

    if (!value && defaultValue === '') {
      this.logger.warn(`Configuration key "${key}" not found`);
    }

    return value;
  }

  /**
   * Mendapatkan nilai dari variabel lingkungan sebagai angka
   * @param key Nama variabel lingkungan
   * @param defaultValue Nilai default jika variabel tidak ditemukan
   * @returns Nilai variabel lingkungan sebagai angka
   */
  getNumber(key: string, defaultValue: number = 0): number {
    const value = this.get(key, defaultValue.toString());

    if (value === '') {
      return defaultValue;
    }

    return Number(value);
  }

  /**
   * Mendapatkan nilai dari variabel lingkungan sebagai boolean
   * @param key Nama variabel lingkungan
   * @param defaultValue Nilai default jika variabel tidak ditemukan
   * @returns Nilai variabel lingkungan sebagai boolean
   */
  getBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = this.get(key, defaultValue.toString());

    if (value === '') {
      return defaultValue;
    }

    return value.toLowerCase() === 'true';
  }

  /**
   * Mendapatkan semua konfigurasi
   * @returns Objek dengan semua konfigurasi
   */
  getAll(): Record<string, string> {
    return { ...this.envConfig };
  }
}