import { AsyncPipe } from '@angular/common';

import { Component, inject } from '@angular/core';

import { Outfit } from '../../models/outfit';

import { OutfitService } from '../../services/outfit';


type SeasonFilter =
  'all' |
  'spring' |
  'summer' |
  'autumn' |
  'winter'; // Legt die möglichen Filterwerte fest.


@Component({

  imports: [AsyncPipe],

  selector: 'app-home',

  styleUrl: './home.css',

  templateUrl: './home.html',

})

export class Home {

  private readonly outfitService =
    inject(OutfitService);

  readonly outfits$ =
    this.outfitService.getOutfits();


  selectedSeason: SeasonFilter =
    'all'; // Speichert den aktuell ausgewählten Filter.


  selectSeason(season: SeasonFilter): void {

    this.selectedSeason =
      season; // Ändert den ausgewählten Filter.

  }


  filterOutfits(outfits: Outfit[]): Outfit[] {

    if (this.selectedSeason === 'all') {

      return outfits; // Zeigt alle Outfits an.

    }

    return outfits.filter(
      (outfit) =>
        outfit.season === this.selectedSeason
    ); // Zeigt nur Outfits der ausgewählten Jahreszeit an.

  }

}