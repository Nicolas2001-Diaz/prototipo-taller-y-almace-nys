import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql
  .createPool({
    host: process.env.MYSQL_ADDON_HOST ,
    port: process.env.MYSQL_ADDON_PORT,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB
  })
  .promise();

export default connection;
