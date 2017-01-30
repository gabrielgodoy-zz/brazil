import * as axios from 'axios';

export default async function getStatesData() {
  let geoNamesAPI = 'http://www.geonames.org/childrenJSON?geonameId=';
  let brazilGeonameID = '3469034';
  return await axios.get(geoNamesAPI + brazilGeonameID);
}
