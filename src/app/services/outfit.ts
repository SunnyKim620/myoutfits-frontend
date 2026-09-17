import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

import { Outfit } from '../models/outfit';


@Service()
export class OutfitService {

     private readonly http = 
     inject(HttpClient); // Stellt Funktionen für HTTP-Anfragen bereit.

     private readonly apiUrl = 
     'http://localhost:3000/api/outfits';  // Adresse der Outfit-API im Backend.

    getOutfits(): Observable<Outfit[]> {

    return this.http.get<Outfit[]>(
        this.apiUrl
    );  // Lädt alle Outfits vom Backend.

    }
 createOutfit(outfitData: FormData): Observable<Outfit> {

  return this.http.post<Outfit>(
    this.apiUrl,
    outfitData
  ); // Sendet die Outfit-Daten und das Bild an das Backend.


}

toggleFavorite(id: string): Observable<Outfit> {

  return this.http.patch<Outfit>(
    `${this.apiUrl}/${id}/favorite`,
    {}
  ); // Wechselt den Favoritenstatus des ausgewählten Outfits.

}

deleteOutfit(id: string): Observable<void> {

  return this.http.delete<void>(
    `${this.apiUrl}/${id}`
  ); // Sendet eine DELETE-Anfrage für das ausgewählte Outfit.

}
}