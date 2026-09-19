import {
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Outfit } from '../../models/outfit';
import { OutfitService } from '../../services/outfit';


@Component({
  selector: 'app-new-outfit',

  imports: [
    FormsModule,
  ],

  templateUrl: './new-outfit.html',
  styleUrl: './new-outfit.css',
})
export class NewOutfit {

  private readonly outfitService =
    inject(OutfitService); // Stellt die Funktionen der Outfit-API bereit.

  private readonly router =
    inject(Router); // Ermöglicht die Navigation zu einer anderen Seite.

    private readonly changeDetectorRef =
  inject(ChangeDetectorRef);
// Aktualisiert die Bildvorschau direkt nach der Dateiauswahl.


  outfit: Outfit = {

    title: '',
    season: 'spring',
    occasion: '',
    color: '',
    description: '',
    favorite: false,

  }; // Enthält die Textdaten des neuen Outfits.


  selectedFile: File | null =
    null; // Speichert die ausgewählte Bilddatei.

  imagePreview =
    ''; // Speichert die Adresse für die Bildvorschau.

  isSaving =
    false; // Zeigt, ob das Outfit gerade gespeichert wird.

  errorMessage =
    ''; // Speichert eine mögliche Fehlermeldung.


  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];


    if (!file) {

      this.selectedFile = null;

      this.imagePreview = '';

      return;

    }


    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];


    if (!allowedTypes.includes(file.type)) {

      this.errorMessage =
        'Bitte wähle ein JPG-, PNG- oder WebP-Bild aus.';

      input.value = '';

      return;

    }


    if (file.size > 5 * 1024 * 1024) {

      this.errorMessage =
        'Das Bild darf höchstens 5 MB groß sein.';

      input.value = '';

      return;

    }


    this.selectedFile = file;

    this.errorMessage = '';


    const reader =
      new FileReader();

    reader.onload = () => {

      this.imagePreview =
        reader.result as string;

   this.changeDetectorRef
    .detectChanges();
  // Aktualisiert die Bildvorschau direkt nach der Dateiauswahl.

};
    reader.readAsDataURL(file);

  }


  saveOutfit(): void {

    this.isSaving = true;

    this.errorMessage = '';


    const outfitData =
      new FormData(); // Erstellt ein Formular für Textdaten und Bilddatei.


    outfitData.append(
      'title',
      this.outfit.title
    );

    outfitData.append(
      'season',
      this.outfit.season
    );

    outfitData.append(
      'occasion',
      this.outfit.occasion
    );

    outfitData.append(
      'color',
      this.outfit.color
    );

    outfitData.append(
      'description',
      this.outfit.description
    );

    outfitData.append(
      'favorite',
      String(this.outfit.favorite)
    );


    if (this.selectedFile) {

      outfitData.append(
        'image',
        this.selectedFile
      ); // Fügt das ausgewählte Bild zum Formular hinzu.

    }


    this.outfitService
      .createOutfit(outfitData)
      .subscribe({

        next: () => {

          this.router.navigate(['/']);

        },

        error: (fehler) => {

          console.error(
            'Fehler beim Speichern des Outfits:',
            fehler
          );

          this.errorMessage =
            'Das Outfit konnte nicht gespeichert werden.';

          this.isSaving = false;

        },

      });

  }

}