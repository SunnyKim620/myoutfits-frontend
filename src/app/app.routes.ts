import { Routes } from '@angular/router';

import { Home } from './pages/home/home';

import { NewOutfit } from './pages/new-outfit/new-outfit';

import { EditOutfit } from './pages/edit-outfit/edit-outfit';

export const routes: Routes = [

  { path: '', 
    component: Home 
  }, // Zeigt die Startseite unter der Adresse / an.


  {
    path: 'outfits/new',
    component: NewOutfit,
  }, 
  // Zeigt das Formular für ein neues Outfit an.

  
  {
    path: 'outfits/:id/edit' ,
    component: EditOutfit,
  },
// Zeigt das Formular zum Bearbeiten eines Outfits an.

];

