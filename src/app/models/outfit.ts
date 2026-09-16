export interface Outfit {

  _id?: string; // Wird von MongoDB automatisch erstellt.

  imageUrl?: string; // Pfad zum hochgeladenen Outfit-Bild.

  title: string; // Name des Outfits.

  season: 'spring' | 'summer' | 'autumn' | 'winter'; // Jahreszeit des Outfits.

  occasion: string; // Anlass, zu dem das Outfit getragen wird.

  color: string; // Hauptfarbe des Outfits.

  description: string; // Zusätzliche Beschreibung.
  
  favorite: boolean; // Zeigt, ob das Outfit ein Favorit ist.
}
