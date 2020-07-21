import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayboardComponent } from './playboard.component';
import { TileComponent } from './tile/tile.component';

@NgModule({
  declarations: [PlayboardComponent, TileComponent],
  imports: [
    CommonModule
  ],
  exports: [PlayboardComponent]
})
export class PlayboardModule { }
