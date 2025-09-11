import pg from 'pg';
import dotenv from 'dotenv';
//import fs from "fs";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'store',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,

  // connectionString:process.env.POSTGRES_URL_NON_POOLING ,
  // ssl: {
  //   ca: fs.readFileSync("./config/certs/prod-ca-2021.crt").toString(),
  // },
   
});

export default pool;


