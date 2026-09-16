import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Outfit } from '../../models/outfit';
import { OutfitService } from '../../services/outfit';


@Component({
  selector: 'app-new-outfit',

  imports: [
    FormsModule,
  ], // Ermöglicht die Verbindung zwischen Formularfeldern und TypeScript.

  templateUrl: './new-outfit.html',
  styleUrl: './new-outfit.css',
})
export class NewOutfit {

  private readonly outfitService =
    inject(OutfitService); // Stellt die Funktionen der Outfit-API bereit.

  private readonly router =
    inject(Router); // Ermöglicht die Navigation zu einer anderen Seite.


  outfit: Outfit = {

    title: '',
    season: 'spring',
    occasion: '',
    color: '',
    description: '',
    favorite: false,

  }; // Enthält die Werte des Formulars für das neue Outfit.


  isSaving = false; // Zeigt, ob das Outfit gerade gespeichert wird.

  errorMessage = ''; // Speichert eine mögliche Fehlermeldung.


  saveOutfit(): void {

    this.isSaving = true; // Deaktiviert den Button während des Speicherns.

    this.errorMessage = ''; // Entfernt eine vorherige Fehlermeldung.


    this.outfitService
      .createOutfit(this.outfit)
      .subscribe({

        next: () => {

          this.router.navigate(['/']); // Öffnet nach erfolgreichem Speichern die Startseite.

        },

        error: (fehler) => {

          console.error(
            'Fehler beim Speichern des Outfits:',
            fehler
          ); // Zeigt den technischen Fehler in der Browser-Konsole an.

          this.errorMessage =
            'Das Outfit konnte nicht gespeichert werden.';

          this.isSaving = false; // Aktiviert den Button nach einem Fehler wieder.

        },

      });

  }

}