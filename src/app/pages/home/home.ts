import { AsyncPipe } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';

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

    private readonly changeDetectorRef =
  inject(ChangeDetectorRef);

    outfits$ =
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

     deleteOutfit(outfit: Outfit): void {

    if (!outfit._id) {

      return; // Beendet die Methode, wenn keine MongoDB-ID vorhanden ist.

    }

    const bestaetigt =
      window.confirm(
        `Möchtest du "${outfit.title}" wirklich löschen?`
      ); // Fragt vor dem Löschen nach einer Bestätigung.


    if (!bestaetigt) {

      return; // Bricht das Löschen ab.

    }


    this.outfitService
      .deleteOutfit(outfit._id)
      .subscribe({

        next: () => {

          this.outfits$ =
            this.outfitService.getOutfits();
          // Lädt die Outfit-Liste nach dem Löschen erneut.

           this.changeDetectorRef.detectChanges();
  // Aktualisiert die Ansicht direkt nach dem Löschen.


        },

        error: (fehler) => {

          console.error(
            'Fehler beim Löschen des Outfits:',
            fehler
          );

          window.alert(
            'Das Outfit konnte nicht gelöscht werden.'
          );

        },

      });

  }
}