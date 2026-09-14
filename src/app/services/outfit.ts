import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Outfit } from '../models/outfit';
import { Observable } from 'rxjs';
@Service()
export class OutfitService {
     private readonly http = inject(HttpClient);
     private readonly apiUrl = 'http://localhost:3000/api/outfits';

    getOutfits(): Observable<Outfit[]> {
    return this.http.get<Outfit[]>(this.apiUrl);
  }
}