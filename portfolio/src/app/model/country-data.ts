// this interface is used in country-data.service to
// define the structure of the country data received from the World Bank API
// 
export interface CountryData{
  iso2Code: string;
  name: string;
  region: {
    value: string;
  };
  incomeLevel: {
    value: string;
  };
  capitalCity: string;
  latitude: string;
  longitude: string;
}