import dotenv from 'dotenv';

dotenv.config();

export const REDIS_URI = process.env.REDIS_URI;
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const DATADREAM_API_KEY = process.env.DATADREAM_API_KEY;

export default [REDIS_URI, PORT, NODE_ENV, DATADREAM_API_KEY];
