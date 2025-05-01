import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
} from 'class-validator';

export class CreateMicroclimateDto {
  @IsNotEmpty()
  @IsDate()
  timestamp!: Date;

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
  irradiation?: number;
}

export class CreateDhtDto {
  @IsNotEmpty()
  @IsDate()
  timestamp!: Date;

  @IsOptional()
  @IsNumber()
  hum_dht22?: number;

  @IsOptional()
  @IsNumber()
  temp_dht22?: number;
}
