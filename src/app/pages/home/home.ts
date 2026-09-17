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
  'winter' |

  'favorites'; // Legt die möglichen Filterwerte fest.
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

      return outfits;

    }

    if (this.selectedSeason === 'favorites') {

      return outfits.filter(
        (outfit) => outfit.favorite
      ); // Zeigt nur als Favorit gespeicherte Outfits an.

    }

    return outfits.filter(
      (outfit) =>
        outfit.season === this.selectedSeason
    ); // Zeigt nur Outfits der ausgewählten Jahreszeit an.

  }



  selectedImageUrl = '';
  // Speichert die Adresse des aktuell vergrößerten Bildes.

  selectedImageTitle = '';
  // Speichert den Namen des aktuell vergrößerten Outfits.

  selectedImageOutfit: Outfit | null = null;
  // Speichert das aktuell angezeigte Outfit.

  modalOutfits: Outfit[] = [];
  // Speichert die Outfits des aktuell ausgewählten Filters.

  selectedImageIndex = -1;
  // Speichert die Position des aktuellen Bildes in der Liste.


  openImage(
    outfit: Outfit,
    outfits: Outfit[]
  ): void {

    this.modalOutfits =
      outfits.filter(
        (element) => Boolean(element.imageUrl)
      );
    // Verwendet nur Outfits, die ein Bild besitzen.

    this.selectedImageIndex =
      this.modalOutfits.findIndex(
        (element) =>
          element._id === outfit._id
      );

    this.updateSelectedImage();

  }


  showPreviousImage(): void {

    if (this.modalOutfits.length === 0) {

      return;

    }

    this.selectedImageIndex =
      (
        this.selectedImageIndex -
        1 +
        this.modalOutfits.length
      ) % this.modalOutfits.length;

    this.updateSelectedImage();
    // Zeigt das vorherige Bild des aktuellen Filters.

  }


  showNextImage(): void {

    if (this.modalOutfits.length === 0) {

      return;

    }

    this.selectedImageIndex =
      (
        this.selectedImageIndex + 1
      ) % this.modalOutfits.length;

    this.updateSelectedImage();
    // Zeigt das nächste Bild des aktuellen Filters.

  }


  private updateSelectedImage(): void {

    const outfit =
      this.modalOutfits[
        this.selectedImageIndex
      ];

    if (!outfit?.imageUrl) {

      return;

    }

    this.selectedImageOutfit =
      outfit;

    this.selectedImageUrl =
      'http://localhost:3000' +
      outfit.imageUrl;

    this.selectedImageTitle =
      outfit.title;

  }


   closeImage(): void {

    this.selectedImageUrl = '';

    this.selectedImageTitle = '';

    this.selectedImageOutfit = null;

    this.modalOutfits = [];

    this.selectedImageIndex = -1;
    // Schließt die Großansicht und leert die Bildauswahl.

  }


  toggleFavorite(outfit: Outfit): void {

    if (!outfit._id) {

      return; // Beendet die Methode, wenn keine MongoDB-ID vorhanden ist.

    }


    this.outfitService
      .toggleFavorite(outfit._id)
      .subscribe({

        next: (aktualisiertesOutfit) => {

          outfit.favorite =
            aktualisiertesOutfit.favorite;
          // Übernimmt den neuen Favoritenstatus vom Backend.

          this.changeDetectorRef.detectChanges();
          // Aktualisiert das Herz direkt in der Ansicht.

        },

        error: (fehler) => {

          console.error(
            'Fehler beim Ändern des Favoritenstatus:',
            fehler
          );

          window.alert(
            'Der Favoritenstatus konnte nicht geändert werden.'
          );

        },

      });

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