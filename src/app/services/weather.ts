import { HttpClient } from '@angular/common/http';
import {
    inject,
    Injectable,
} from '@angular/core';

import { Observable } from 'rxjs';


export interface WeatherResponse {

    current: {

        temperature_2m: number;

        apparent_temperature: number;

        precipitation: number;

        weather_code: number;

    };

}
// Beschreibt die Wetterdaten, die von Open-Meteo zurückgegeben werden.


@Injectable({
    providedIn: 'root',
})
export class Weather {

    private readonly http =
        inject(HttpClient);
    // Stellt Funktionen für HTTP-Anfragen bereit.

    private readonly apiUrl =
        'https://api.open-meteo.com/v1/forecast';
    // Speichert die Grundadresse der Wetter-API.

    getCurrentWeather(
        latitude = 52.52,
        longitude = 13.41
    ): Observable<WeatherResponse> {

        const url =
            this.apiUrl +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            '&current=temperature_2m,apparent_temperature,precipitation,weather_code' +
            '&timezone=auto';
        // Erstellt die Wetteradresse mit den übergebenen Koordinaten.


        return this.http.get<WeatherResponse>(
            url
        );
        // Verwendet Berlin, wenn keine anderen Koordinaten übergeben werden.

    }
}