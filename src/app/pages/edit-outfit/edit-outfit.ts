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


  this.outfitService
    .getOutfit(id)
    .subscribe({

      next: (outfit) => {

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
onFileSelected(event: Event): void {

  const input =
    event.target as HTMLInputElement;

  const file =
    input.files?.[0];


  if (!file) {

    return;
    // Behält das bisherige Bild, wenn kein neues ausgewählt wird.

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
    .subscribe({

      next: () => {

        this.router.navigate(['/']);
        // Kehrt nach erfolgreicher Änderung zur Startseite zurück.

      },

      error: (fehler) => {

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

cancelEdit(): void {

 this.router.navigate(['/']);
  // Bricht die Bearbeitung ab und kehrt zur Startseite zurück.

}

}