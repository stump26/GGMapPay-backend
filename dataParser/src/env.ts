import dotenv from 'dotenv';

dotenv.config();

export const DORO_API = process.env.DORO_API;
export const COORD_API = process.env.COORD_API;
export const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

export default [DORO_API, COORD_API, KAKAO_REST_API_KEY];
