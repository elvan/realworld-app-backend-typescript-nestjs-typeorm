import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'realworld_nestjs_typeorm',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  entities: ['dist/**/*.entity{.ts,.js}'],
  logging: process.env.NODE_ENV === 'development',
}));
