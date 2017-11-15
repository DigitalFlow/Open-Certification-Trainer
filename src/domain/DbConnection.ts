import { Pool, PoolConfig, QueryResult } from "pg";

console.log("Constructing DB pool");

const poolConfig = {
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
};

// Connect to mysql
const pool = new Pool(poolConfig);
export default pool;
