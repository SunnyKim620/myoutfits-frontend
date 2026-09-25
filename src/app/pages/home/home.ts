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

import { Weather } from '../../services/weather';


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

  private readonly weatherService =
  inject(Weather);
// Stellt die aktuellen Wetterdaten für Berlin bereit.

  private readonly changeDetectorRef =
    inject(ChangeDetectorRef);


  outfits$ =
    this.outfitService.getOutfits();

    isWeatherModalOpen = false;
// Speichert, ob die Wetterempfehlung geöffnet ist.


isWeatherLoading = false;
// Zeigt, ob die Wetterdaten gerade geladen werden.


weatherErrorMessage = '';
// Speichert eine mögliche Fehlermeldung.

weatherLocation = 'Berlin';
// Speichert den Namen des verwendeten Wetterstandorts.

currentTemperature: number | null =
  null;
// Speichert die Temperatur des aktuellen Standorts oder von Berlin.


weatherDescription = '';
// Speichert die Beschreibung des aktuellen Wetters.


weatherIcon = '🌦️';
// Speichert das passende Wettersymbol.


recommendedOutfit: Outfit | null =
  null;
// Speichert das aktuell empfohlene Outfit.


weatherOutfits: Outfit[] = [];
// Speichert alle Outfits, die zum aktuellen Wetter passen.


weatherOutfitIndex = 0;
// Speichert die Position des aktuell empfohlenen Outfits.


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

private getRecommendedSeasons(
  temperature: number
): string[] {

  if (temperature >= 25) {

    return [
      'summer',
    ];

  }

  if (temperature >= 18) {

    return [
      'spring',
      'summer',
    ];

  }

  if (temperature >= 10) {

    return [
      'spring',
      'autumn',
    ];

  }

  return [
    'winter',
  ];

}
// Bestimmt anhand der Temperatur passende Jahreszeiten.

private updateWeatherDisplay(
  weatherCode: number
): void {

  if (weatherCode === 0) {

    this.weatherIcon = '☀️';

    this.weatherDescription =
      'Heute ist es sonnig.';

    return;

  }

  if (
    weatherCode >= 51 &&
    weatherCode <= 67 ||
    weatherCode >= 80 &&
    weatherCode <= 82
  ) {

    this.weatherIcon = '🌧️';

    this.weatherDescription =
      'Heute ist es regnerisch.';

    return;

  }

  if (
    weatherCode >= 71 &&
    weatherCode <= 77
  ) {

    this.weatherIcon = '❄️';

    this.weatherDescription =
      'Heute schneit es.';

    return;

  }

  if (weatherCode >= 95) {

    this.weatherIcon = '⛈️';

    this.weatherDescription =
      'Heute gibt es ein Gewitter.';

    return;

  }

  this.weatherIcon = '☁️';

  this.weatherDescription =
    'Heute ist es bewölkt.';

}
// Erstellt aus dem Wettercode ein Symbol und eine Beschreibung.


openWeatherRecommendation(): void {

  if (!navigator.geolocation) {

    this.weatherLocation =
      'Berlin';

    this.loadWeatherRecommendation();

    return;

  }


  navigator.geolocation
    .getCurrentPosition(

      (position) => {

        this.weatherLocation =
          'deiner Nähe';

        this.loadWeatherRecommendation(
          position.coords.latitude,
          position.coords.longitude
        );

      },

      () => {

        this.weatherLocation =
          'Berlin';

        this.loadWeatherRecommendation();
        // Verwendet Berlin, wenn der Standort nicht erlaubt ist.

      },

      {
        enableHighAccuracy: false,
        timeout: 7000,
        maximumAge: 300000,
      }

    );

}
// Verwendet den aktuellen Standort oder Berlin als Ersatz.


private loadWeatherRecommendation(
  latitude = 52.52,
  longitude = 13.41
): void {


  this.isWeatherModalOpen = true;

  this.isWeatherLoading = true;

  this.weatherErrorMessage = '';

  this.recommendedOutfit = null;


  forkJoin({

    weather:
      this.weatherService
        .getCurrentWeather(
        latitude,
        longitude
),

    outfits:
      this.outfitService
        .getOutfits(),

  }).subscribe({

    next: ({
      weather,
      outfits,
    }) => {

      const currentWeather =
        weather.current;

      this.currentTemperature =
        Math.round(
          currentWeather.temperature_2m
        );

      this.updateWeatherDisplay(
        currentWeather.weather_code
      );


      const recommendedSeasons =
        this.getRecommendedSeasons(
          currentWeather
            .apparent_temperature
        );
      // Verwendet die gefühlte Temperatur für die Empfehlung.


      const suitableOutfits =
        outfits.filter(
          (outfit) =>
            recommendedSeasons.includes(
              outfit.season
            )
        );
      // Sucht Outfits mit einer passenden Jahreszeit.


      this.weatherOutfits =
        suitableOutfits.length > 0
          ? suitableOutfits
          : outfits;
      // Verwendet alle Outfits, wenn keine passende Jahreszeit gefunden wird.


      this.weatherOutfitIndex = 0;

      this.recommendedOutfit =
        this.weatherOutfits[0] ??
        null;


      if (!this.recommendedOutfit) {

        this.weatherErrorMessage =
          'Es sind noch keine Outfits gespeichert.';

      }


      this.isWeatherLoading = false;

      this.changeDetectorRef
        .detectChanges();

    },

    error: (fehler) => {

      console.error(
        'Fehler beim Laden der Wetterempfehlung:',
        fehler
      );

      this.weatherErrorMessage =
        'Die Wetterempfehlung konnte nicht geladen werden.';

      this.isWeatherLoading = false;

      this.changeDetectorRef
        .detectChanges();

    },

  });

}

closeWeatherRecommendation(): void {

  this.isWeatherModalOpen = false;
  // Schließt die Wetterempfehlung.

}


showNextWeatherOutfit(): void {


  if (this.weatherOutfits.length === 0) {

    return;

  }


  this.weatherOutfitIndex =
    (
      this.weatherOutfitIndex + 1
    ) % this.weatherOutfits.length;
  // Springt nach dem letzten Outfit wieder zum ersten Outfit.


  this.recommendedOutfit =
    this.weatherOutfits[
      this.weatherOutfitIndex
    ];

}
// Zeigt das nächste Outfit der Wetterempfehlung.


openRecommendedOutfit(): void {

  const outfit =
    this.recommendedOutfit;


  if (!outfit) {

    return;

  }


  this.closeWeatherRecommendation();

  this.openImage(
    outfit,
    this.weatherOutfits
  );
  // Öffnet das empfohlene Outfit in der vorhandenen Großansicht.

}


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

      // Beendet die Methode, wenn keine MongoDB-ID vorhanden ist.‚
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

    // Zeigt nur als Favorit gespeicherte Outfits an.
      return outfits.filter(
        (outfit) => outfit.favorite
      );

    }

    // Zeigt nur Outfits der ausgewählten Jahreszeit an.
  return outfits.filter(
      (outfit) =>
        outfit.season ===
        this.selectedSeason
    );


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

      // Beendet die Methode, wenn keine MongoDB-ID vorhanden ist.
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