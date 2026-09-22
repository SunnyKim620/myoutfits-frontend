import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { Outfit } from '../../models/outfit';

import { OutfitService } from '../../services/outfit';

@Component({
  imports: [
  FormsModule,
],
  selector: 'app-edit-outfit',
  styleUrl: './edit-outfit.css',
  templateUrl: './edit-outfit.html',
})
export class EditOutfit implements OnInit {

  private readonly outfitService =
    inject(OutfitService);
  // Stellt die Funktionen der Outfit-API bereit.

  private readonly route =
    inject(ActivatedRoute);
  // Liest die ID aus der aktuellen Adresse.

  private readonly router =
    inject(Router);
  // Ermöglicht die Navigation zur Startseite.

  private readonly changeDetectorRef =
    inject(ChangeDetectorRef);
  // Aktualisiert die Ansicht nach einer HTTP-Anfrage.


  outfitId = '';
  // Speichert die MongoDB-ID des Outfits.


  outfit: Outfit = {
    title: '',
    season: 'spring',
    occasion: '',
    color: '',
    description: '',
    favorite: false,
  };
  // Enthält die Daten des bearbeiteten Outfits.


  selectedFile: File | null = null;
  // Speichert ein neu ausgewähltes Bild.


  imagePreview = '';
  // Zeigt das bisherige oder neu ausgewählte Bild.


  isLoading = true;

  isSaving = false;

  errorMessage = '';


// Lädt beim Öffnen der Seite das vorhandene Outfit.
ngOnInit(): void {

  const id =
    this.route.snapshot.paramMap.get(
      'id'
    );
  // Liest die ID aus /outfits/:id/edit.


  if (!id) {

    this.errorMessage =
      'Das Outfit konnte nicht gefunden werden.';

    this.isLoading = false;

    return;

  }


  this.outfitId = id;
// Speichert die ID des aktuell bearbeiteten Outfits.

  this.outfitService
    .getOutfit(id)
    // Lädt das Outfit mit dieser ID vom Backend.
    .subscribe({
  // Verarbeitet die Antwort der HTTP-Anfrage.

      next: (outfit) => {
 // Wird ausgeführt, wenn das Outfit erfolgreich geladen wurde.

        this.outfit = outfit;
        // Übernimmt die vorhandenen Daten in das Formular.


        if (outfit.imageUrl) {

          this.imagePreview =
            'http://localhost:3000' +
            outfit.imageUrl;
          // Zeigt das bisher gespeicherte Bild an.

        }


        this.isLoading = false;

        this.changeDetectorRef
          .detectChanges();

      },

      error: (fehler) => {
// Wird ausgeführt, wenn das Laden des Outfits fehlschlägt.

        console.error(
          'Fehler beim Laden des Outfits:',
          fehler
        );

        this.errorMessage =
          'Das Outfit konnte nicht geladen werden.';

        this.isLoading = false;

        this.changeDetectorRef
          .detectChanges();

      },

    });

}

// Verarbeitet ein neu ausgewähltes Bild und erstellt eine Vorschau.
onFileSelected(event: Event): void {

  const input =
    event.target as HTMLInputElement;
// Greift auf das Datei-Eingabefeld zu.

  const file =
    input.files?.[0];
// Liest die erste ausgewählte Datei.

  if (!file) {

    return;
    // Behält das bisherige Bild, wenn kein neues ausgewählt wird.

  }


  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];
// Legt die erlaubten Bildformate fest.

  if (!allowedTypes.includes(file.type)) {

    this.errorMessage =
      'Bitte wähle ein JPG-, PNG- oder WebP-Bild aus.';

    input.value = '';

    return;

  }


  if (file.size > 5 * 1024 * 1024) {
// Prüft, ob das Bild größer als 5 MB ist.


    this.errorMessage =
      'Das Bild darf höchstens 5 MB groß sein.';

    input.value = '';

    return;

  }


  this.selectedFile = file;

  this.errorMessage = '';


  const reader =
    new FileReader();
// Liest die ausgewählte Bilddatei für die Vorschau.

  reader.onload = () => {

    this.imagePreview =
      reader.result as string;

    this.changeDetectorRef
      .detectChanges();
    // Aktualisiert die Bildvorschau direkt nach der Dateiauswahl.

  };


  reader.readAsDataURL(file);

}


// Sendet die geänderten Outfit-Daten an das Backend.
updateOutfit(): void {

  if (!this.outfitId) {

    return;
    // Beendet die Methode, wenn keine MongoDB-ID vorhanden ist.

  }


  this.isSaving = true;

  this.errorMessage = '';


  const outfitData =
    new FormData();
  // Erstellt ein Formular für Textdaten und eine mögliche Bilddatei.


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
    );
    // Fügt nur ein Bild hinzu, wenn ein neues ausgewählt wurde.

  }


  this.outfitService
    .updateOutfit(
      this.outfitId,
      outfitData
    )
    // Sendet die ID und die geänderten Daten an das Backend.

    .subscribe({

      next: () => {
 // Wird nach einer erfolgreichen Aktualisierung ausgeführt.

        this.router.navigate(['/']);
        // Kehrt nach erfolgreicher Änderung zur Startseite zurück.

      },

      error: (fehler) => {
         // Wird ausgeführt, wenn die Aktualisierung fehlschlägt.
         

        console.error(
          'Fehler beim Aktualisieren des Outfits:',
          fehler
        );

        this.errorMessage =
          'Das Outfit konnte nicht aktualisiert werden.';

        this.isSaving = false;

        this.changeDetectorRef
          .detectChanges();

      },

    });

}


// Bricht die Bearbeitung ab und navigiert zurück zur Startseite.
cancelEdit(): void {

 this.router.navigate(['/']);


}

}