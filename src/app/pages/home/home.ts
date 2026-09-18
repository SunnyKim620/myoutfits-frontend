import { AsyncPipe } from '@angular/common';

import { RouterLink } from '@angular/router';

import {
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';

import { forkJoin } from 'rxjs';

import { Outfit } from '../../models/outfit';

import { OutfitService } from '../../services/outfit';


type SeasonFilter =
  | 'all'
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter'
  | 'favorites';
// Legt die möglichen Filterwerte fest.


@Component({
  imports: [
  AsyncPipe,
  RouterLink,
],
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
    'all';
  // Speichert den aktuell ausgewählten Filter.


  selectionMode = false;
  // Speichert, ob der Auswahlmodus aktiviert ist.


  selectedOutfitIds =
    new Set<string>();
  // Speichert die IDs der ausgewählten Outfits.


  selectedImageUrl = '';
  // Speichert die Adresse des aktuell vergrößerten Bildes.


  selectedImageTitle = '';
  // Speichert den Namen des aktuell vergrößerten Outfits.


  selectedImageOutfit: Outfit | null =
    null;
  // Speichert das aktuell angezeigte Outfit.


  modalOutfits: Outfit[] = [];
  // Speichert die Outfits des aktuell ausgewählten Filters.


  selectedImageIndex = -1;
  // Speichert die Position des aktuellen Bildes in der Liste.


  toggleSelectionMode(): void {

    this.selectionMode =
      !this.selectionMode;
    // Aktiviert oder beendet den Auswahlmodus.

    if (!this.selectionMode) {

      this.selectedOutfitIds.clear();
      // Entfernt die Auswahl beim Beenden des Auswahlmodus.

    }

  }


  isOutfitSelected(
    outfit: Outfit
  ): boolean {

    return Boolean(
      outfit._id &&
      this.selectedOutfitIds.has(
        outfit._id
      )
    );
    // Prüft, ob das Outfit ausgewählt ist.

  }


  toggleOutfitSelection(
    outfit: Outfit
  ): void {

    if (!outfit._id) {

      return;

    }

    if (
      this.selectedOutfitIds.has(
        outfit._id
      )
    ) {

      this.selectedOutfitIds.delete(
        outfit._id
      );
      // Entfernt das Outfit aus der Auswahl.

    } else {

      this.selectedOutfitIds.add(
        outfit._id
      );
      // Fügt das Outfit zur Auswahl hinzu.

    }

  }


  selectAllVisibleOutfits(
    outfits: Outfit[]
  ): void {

    for (const outfit of outfits) {

      if (outfit._id) {

        this.selectedOutfitIds.add(
          outfit._id
        );

      }

    }
    // Wählt alle aktuell sichtbaren Outfits aus.

  }


  clearOutfitSelection(): void {

    this.selectedOutfitIds.clear();
    // Entfernt alle Outfits aus der Auswahl.

  }


  selectSeason(
    season: SeasonFilter
  ): void {

    this.selectedSeason =
      season;
    // Ändert den ausgewählten Filter.

    this.selectedOutfitIds.clear();
    // Entfernt die bisherige Auswahl beim Filterwechsel.

  }


  filterOutfits(
    outfits: Outfit[]
  ): Outfit[] {

    if (
      this.selectedSeason === 'all'
    ) {

      return outfits;

    }

    if (
      this.selectedSeason ===
      'favorites'
    ) {

      return outfits.filter(
        (outfit) => outfit.favorite
      );
      // Zeigt nur als Favorit gespeicherte Outfits an.

    }

    return outfits.filter(
      (outfit) =>
        outfit.season ===
        this.selectedSeason
    );
    // Zeigt nur Outfits der ausgewählten Jahreszeit an.

  }


  openImage(
    outfit: Outfit,
    outfits: Outfit[]
  ): void {

    this.modalOutfits =
      outfits.filter(
        (element) =>
          Boolean(element.imageUrl)
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

    if (
      this.modalOutfits.length === 0
    ) {

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

    if (
      this.modalOutfits.length === 0
    ) {

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


  toggleFavorite(
    outfit: Outfit
  ): void {

    if (!outfit._id) {

      return;

    }

    this.outfitService
      .toggleFavorite(outfit._id)
      .subscribe({

        next:
          (aktualisiertesOutfit) => {

            outfit.favorite =
              aktualisiertesOutfit.favorite;
            // Übernimmt den Favoritenstatus vom Backend.

            this.changeDetectorRef
              .detectChanges();

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


  deleteSelectedOutfits(): void {

    const ids =
      Array.from(
        this.selectedOutfitIds
      );
    // Erstellt eine Liste mit den ausgewählten IDs.

    if (ids.length === 0) {

      window.alert(
        'Bitte wähle mindestens ein Outfit aus.'
      );

      return;

    }

    const bestaetigt =
      window.confirm(
        `Möchtest du ${ids.length} ausgewählte Outfits wirklich löschen?`
      );
    // Fragt vor dem Löschen nach einer Bestätigung.

    if (!bestaetigt) {

      return;

    }

    const loeschanfragen =
      ids.map(
        (id) =>
          this.outfitService
            .deleteOutfit(id)
      );
    // Erstellt für jedes Outfit eine DELETE-Anfrage.

    forkJoin(loeschanfragen)
      .subscribe({

        next: () => {

          this.selectedOutfitIds
            .clear();

          this.selectionMode = false;

          this.outfits$ =
            this.outfitService
              .getOutfits();
          // Lädt die Liste nach dem Löschen erneut.

          this.changeDetectorRef
            .detectChanges();

        },

        error: (fehler) => {

          console.error(
            'Fehler beim Löschen der ausgewählten Outfits:',
            fehler
          );

          window.alert(
            'Die ausgewählten Outfits konnten nicht vollständig gelöscht werden.'
          );

        },

      });

  }


  deleteOutfit(
    outfit: Outfit
  ): void {

    if (!outfit._id) {

      return;

    }

    const bestaetigt =
      window.confirm(
        `Möchtest du "${outfit.title}" wirklich löschen?`
      );
    // Fragt vor dem Löschen nach einer Bestätigung.

    if (!bestaetigt) {

      return;

    }

    this.outfitService
      .deleteOutfit(outfit._id)
      .subscribe({

        next: () => {

          this.outfits$ =
            this.outfitService
              .getOutfits();
          // Lädt die Liste nach dem Löschen erneut.

          this.changeDetectorRef
            .detectChanges();

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