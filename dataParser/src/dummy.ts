import { getCoord, searchKakao } from './utils/location';

import fs from 'fs';
import redis from 'redis';

interface StoreInfo {
  storeId: number;
}
type ObjectDataType = {
  SIGUN_NM: string;
  CMPNM_NM: string;
  INDUTYPE_NM: string;
  REFINE_ROADNM_ADDR: string;
  REFINE_LOTNO_ADDR: string;
  TELNO: string;
  REFINE_ZIP_CD: string;
  REFINE_WGS84_LAT: string;
  REFINE_WGS84_LOGT: string;
  DATA_STD_DE: string;
};

const client = redis.createClient({
  url: 'redis://localhost:6379',
});

const onewayID = (hashSize: number): string => {
  return Math.random().toString(36).substr(2, hashSize);
};

const setRedis = (objectData: any) => {
  client.geoadd(
    'store',
    objectData.REFINE_WGS84_LOGT,
    objectData.REFINE_WGS84_LAT,
    JSON.stringify(objectData),
  );
};

const setCoord = async (dataArray: Array<string>) => {
  return dataArray.map(
    async (data: string): Promise<ObjectDataType> => {
      const lineData = data
        .split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
        .map((a) => a.replace(/"|'/, ''));

      const objectData: ObjectDataType = {
        SIGUN_NM: lineData[0],
        CMPNM_NM: lineData[1],
        INDUTYPE_NM: lineData[2],
        REFINE_ROADNM_ADDR: lineData[3],
        REFINE_LOTNO_ADDR: lineData[4],
        TELNO: lineData[5],
        REFINE_ZIP_CD: lineData[6],
        REFINE_WGS84_LAT: lineData[7],
        REFINE_WGS84_LOGT: lineData[8],
        DATA_STD_DE: lineData[9],
      };

      let coord;

      if (!objectData.REFINE_WGS84_LOGT || !objectData.REFINE_WGS84_LAT) {
        if (objectData.REFINE_ROADNM_ADDR) {
          coord = await getCoord(objectData.REFINE_ROADNM_ADDR);
        } else if (objectData.REFINE_LOTNO_ADDR) {
          coord = await getCoord(objectData.REFINE_LOTNO_ADDR);
        }
        if (coord) {
          objectData.REFINE_WGS84_LOGT = coord.longitude.toString();
          objectData.REFINE_WGS84_LAT = coord.latitude.toString();
        }

        return objectData;
      }

      return objectData;
    },
  );
};

fs.readFile('assets/data.csv', 'utf8', async function (err, data) {
  if (err) {
    console.error('err', err);
  }
  let dataArray = data.split(/\r?\n/);
  dataArray.shift();

  const asyncCoordResDatas = await setCoord(dataArray);
  Promise.all(asyncCoordResDatas).then((coordResData) => {
    console.log('coord set done.');
    console.log('search detail info by Kakao');
    let cntNull = 0;
    let ntScs = 0;
    coordResData
      .reduce(
        (chain, item) =>
          chain.then(
            async (): Promise<any> => {
              const res = await searchKakao(
                item!.CMPNM_NM,
                item!.SIGUN_NM,
                item!.REFINE_WGS84_LOGT,
                item!.REFINE_WGS84_LAT,
              );
              if (res.length === 0) {
                cntNull++;
              } else {
                ntScs++;
              }

              console.log('inprogress', cntNull, ntScs);
            },
          ),
        Promise.resolve(),
      )
      .then(() =>
        console.log('all finished, one after the other', cntNull, ntScs),
      );
  });

  return;
});
