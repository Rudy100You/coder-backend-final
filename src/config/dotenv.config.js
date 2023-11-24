import dotenv from "dotenv"
import { __root_dirname, pathJoin } from "../utils/utils.js";


dotenv.config({ path: pathJoin(__root_dirname, ".env" )});

export const {
  RAILWAY_PUBLIC_DOMAIN,
  ENV_STAGE,
  MDB_USER,
  MDB_PASS,
  MDB_HOST,
  MDB_DEV_USER,
  MDB_DEV_PASS,
  MDB_DEV_HOST,
  DATABASE_NAME,
  PORT,
  PROD_ENDPOINT,
  GH_SESSION_SECRET,
  GH_CLIENT_ID,
  PERSISTENCE,
  APP_URL
} = process.env;