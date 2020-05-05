import { gql } from 'apollo-server-express';

const typeDef = gql`
  type STORE_INFO {
    SIGUN_NM: String! #시군명
    CMPNM_NM: String! #상호명
    INDUTYPE_NM: String #업종명(종목명)
    REFINE_ROADNM_ADDR: String #소재지도로명주소
    REFINE_LOTNO_ADDR: String #소재지지번주소
    TELNO: String #전화번호
    REFINE_ZIP_CD: Int #우편번호
    REFINE_WGS84_LAT: Float #위도
    REFINE_WGS84_LOGT: Float #경도
    DATA_STD_DE: String #데이터기준일자
  }

  type SEARCH_REASULT {
    TOTAL_PAGE: Int!
    CUR_PAGE: Int!
    STORES: [STORE_INFO]
  }
  extend type Query {
    getAroundStore(lat: Float!, long: Float!): [STORE_INFO]
    getSearchStore(query: String!, SIGUN_CD: Int, page: Int): SEARCH_REASULT
  }
`;

export default typeDef;
