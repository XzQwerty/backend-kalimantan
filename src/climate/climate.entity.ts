import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('microclimate_kalimantan') // Nama tabel di database
export class Microclimate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp' })
  timestamp!: Date;

  @Column({ type: 'float', nullable: true })
  temperature!: number;

  @Column({ type: 'float', nullable: true })
  humidity!: number;

  @Column({ type: 'float', nullable: true })
  rainfall!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  direction!: string;

  @Column({ type: 'float', nullable: true })
  angle!: number;

  @Column({ type: 'float', nullable: true })
  wind_speed!: number;

  @Column({ type: 'float', nullable: true, name: 'pyrano' }) // Alias untuk kolom
  irradiation!: number;
}

@Entity('dht_kalimantan') // Nama tabel di database
export class Dht {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp' })
  timestamp!: Date;

  @Column({ type: 'float', nullable: true })
  hum_dht22!: number;

  @Column({ type: 'float', nullable: true })
  temp_dht22!: number;
}
