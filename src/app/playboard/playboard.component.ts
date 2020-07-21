import { Component, OnInit, HostListener } from '@angular/core';
import { TileComponent } from './tile/tile.component';

@Component({
  selector: 'app-playboard',
  templateUrl: './playboard.component.html',
  styleUrls: ['./playboard.component.css']
})
export class PlayboardComponent implements OnInit {

  tiles: TileComponent[];
  score: number = -1;
  isGameOver: boolean = false;
  isGameCompleted: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:keyup', ['$event']) 
  handleKeyboardControls(event: KeyboardEvent) {

  }

}
