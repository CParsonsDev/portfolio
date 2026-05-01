import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CountryData } from '../model/country-data';

@Injectable({
  providedIn: 'root',
})
export class WorldbankApi {
  constructor(private http: HttpClient) {}
  // Accepts a two-letter country code as an input parameter
  getCountryData(iso2Code: string): Observable <CountryData[]> {
    console.log('Calling World Bank API for Country Code: ', {iso2Code}, '\nretrieving Country Data.');
    const url = (`https://api.worldbank.org/V2/country/${iso2Code}?&format=json`);
    console.log('Accessing: ', url);
    // returns additional information gathered from the API for the selected country
    return this.http.get<any[]>(url).pipe(
      map((response) => response[1] as CountryData[])
    );
  }
}