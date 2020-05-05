import { DATADREAM_API_KEY } from '../../env';
import axios from 'axios';
import { getAround } from '../../lib/RedisAPI/redis';

type GET_AROUND_VALUES = {
  long: number;
  lat: number;
};

type GET_SEARCH_STORE = {
  query: string;
  SIGUN_CD?: number;
  page: number;
};

const APIURL = 'https://openapi.gg.go.kr/RegionMnyFacltStus?Type=json';

const resolvers = {
  Query: {
    getAroundStore: async (_: any, { long, lat }: GET_AROUND_VALUES) => {
      const aroundInfo: any = await getAround({
        longitude: long,
        latitude: lat,
      });

      const objAroundInfo = aroundInfo.reduce(
        (acc: Array<IStoreInfoType>, cur: string) => {
          const objCur = JSON.parse(cur);
          return [...acc, objCur];
        },
        [],
      );
      return objAroundInfo;
    },
    getSearchStore: async (
      _: any,
      { query, SIGUN_CD, page = 1 }: GET_SEARCH_STORE,
    ) => {
      console.log('page', page);
      let url = `${APIURL}&KEY=${DATADREAM_API_KEY}&CMPNM_NM=${encodeURIComponent(
        query,
      )}`;
      if (SIGUN_CD) {
        url += `&SIGUN_CD=${SIGUN_CD}`;
      }
      if (page) {
        url += `&pIndex=${page}`;
      }

      const result: any = {};
      const res = await axios.get(url);
      const cnt = Math.floor(
        res.data.RegionMnyFacltStus[0].head[0].list_total_count / 100,
      );
      result.STORES = res.data.RegionMnyFacltStus[1].row;
      result.TOTAL_PAGE = cnt + 1;
      result.CUR_PAGE = page;

      return result;
    },
  },
};

export default resolvers;
