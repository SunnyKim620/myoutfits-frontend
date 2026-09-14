import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OutfitService } from '../../services/outfit';

@Component({
  imports: [AsyncPipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private readonly outfitService = inject(OutfitService);

  readonly outfits$ = this.outfitService.getOutfits();
}