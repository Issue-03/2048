import { Component, Input } from '@angular/core';
import { Tile } from 'src/app/models/tile.model';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent {
  @Input() tile: Tile;

  constructor() { }

  get class(): string {
    const base = `color-${this.tile.value}`;
    if (this.tile.value === null) return 'empty';
    if (this.tile.wasTileMerged) return `${base} merged`;
    return base;
  }

}
