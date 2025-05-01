import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class MicroclimatePayload {
  @IsNotEmpty()
  @IsDateString()
  timestamp!: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  humidity?: number;

  @IsOptional()
  @IsNumber()
  rainfall?: number;

  @IsOptional()
  @IsString()
  direction?: string;

  @IsOptional()
  @IsNumber()
  angle?: number;

  @IsOptional()
  @IsNumber()
  wind_speed?: number;

  @IsOptional()
  @IsNumber()
  pyrano?: number;
}

export class DhtPayload {
  @IsNotEmpty()
  @IsDateString()
  timestamp!: string;

  @IsOptional()
  @IsNumber()
  hum_dht22?: number;

  @IsOptional()
  @IsNumber()
  temp_dht22?: number;
}
