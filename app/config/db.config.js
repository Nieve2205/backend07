const isProduction = process.env.NODE_ENV === 'production';

const config = isProduction
  ? {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
    }
  : {
      HOST: 'localhost',
      USER: 'root',
      PASSWORD: '',
      DB: 'db',
      PORT: 3306,
      dialect: 'mysql',
    };

export default {
  ...config,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
