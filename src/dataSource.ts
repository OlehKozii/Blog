import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: `.development.env` });
// dotenv.config({ path: `.production.env` });
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: `${process.env.TYPEORM_URL}`,
  // synchronize: true,
  logging: [
    process.env.NODE_ENV === 'development' ? 'query' : undefined,
    'warn',
    'error',
  ],
  entities: [__dirname + '/database/entities/*{.js, .ts}'],
  migrations: [__dirname + '/database/migrations/*{.ts, .js}'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
