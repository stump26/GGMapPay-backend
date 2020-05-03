import { COORD_API, DORO_API, KAKAO_REST_API_KEY } from '../env';
import axios, { AxiosRequestConfig } from 'axios';
import proj4, { toPoint } from 'proj4';

import qs from 'qs';

const SEARCHDORO_URL = 'http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do';
const SEARCHCOORD_URL = 'http://www.juso.go.kr/addrlink/addrCoordApiJsonp.do';
const KAKAO_MAP_SEARCH_API_URL =
  'https://dapi.kakao.com/v2/local/search/keyword.json';

const searchDoro = async (addr: string) => {
  const data = {
    confmKey: DORO_API,
    keyword: addr,
    resultType: 'JSON',
  };
  const options: AxiosRequestConfig = {
    method: 'POST',
    url: SEARCHDORO_URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  };

  const res = await axios(options);
  const filterRes = res.data.replace(/^\(|\)$/g, '');
  const jsonObj = await JSON.parse(filterRes);
  return jsonObj.results;
};

const searchCOORD = async (doroJUSO: any) => {
  const data = {
    confmKey: COORD_API,
    admCd: doroJUSO.admCd,
    rnMgtSn: doroJUSO.rnMgtSn,
    udrtYn: doroJUSO.udrtYn,
    buldMnnm: doroJUSO.buldMnnm,
    buldSlno: doroJUSO.buldSlno,
    resultType: 'json',
  };
  const options: AxiosRequestConfig = {
    method: 'POST',
    url: SEARCHCOORD_URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  };
  const res = await axios(options);
  const filterRes = res.data.replace(/^\(|\)$/g, '');
  const jsonObj = await JSON.parse(filterRes);
  return jsonObj.results;
};

export const searchKakao = async (
  query: string,
  sigun: string,
  longitude?: string | number,
  latitude?: string | number,
) => {
  const url = `${KAKAO_MAP_SEARCH_API_URL}?query=${encodeURIComponent(
    query + ' ' + sigun,
  )}${longitude ? '&x=' + longitude : ''}${latitude ? '&y=' + latitude : ''}`;

  const options: AxiosRequestConfig = {
    method: 'GET',
    url,
    headers: {
      Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
    },
  };
  try {
    const res = await axios(options);
    return res.data.documents;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const coordTransform = (x: number, y: number) => {
  const pos = toPoint([x, y]);
  const p = proj4(
    '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs',
    'WGS84',
    pos,
  );
  return p;
};

export const getCoord = async (doroJuso: string) => {
  try {
    const doroInfo = await searchDoro(doroJuso);
    if (doroInfo.juso[0]) {
      const coord = await searchCOORD(doroInfo.juso[0]);
      const { entX, entY } = coord.juso[0];
      const wgs84 = coordTransform(Number(entX), Number(entY));
      return { longitude: wgs84.x, latitude: wgs84.y };
    } else {
      throw 'juso not found';
    }
  } catch (e) {
    return undefined;
  }
};
