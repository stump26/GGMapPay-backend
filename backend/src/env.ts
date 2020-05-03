import dotenv from 'dotenv';

dotenv.config();

export const REDIS_URI = process.env.REDIS_URI;
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;

export default [REDIS_URI, PORT, NODE_ENV];
