import { Component, OnInit, HostListener } from '@angular/core';

import { GameService } from '../services/game.service';
import { KEYCODE, Direction } from '../models/direction';
import { Tile } from '../models/tile.model';

@Component({
  selector: 'app-playboard',
  templateUrl: './playboard.component.html',
  styleUrls: ['./playboard.component.css']
})
export class PlayboardComponent implements OnInit {

  tiles: Tile[];
  score: number = -1;
  isGameOver: boolean = false;
  isGameCompleted: boolean = false;
  lastTenScores: number[];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.initializePlayboard();
    this.gameService.loadData();
    this.refreshLastTenScores();
  }

  // handles the direction of player's move
  handleParticularDirection(direction: any) {
    let isMoveSuccess = false;
    if (this.isGameOver || direction === undefined) return;
    this.gameService.moveTiles(direction).subscribe((mergedScore: number) => {
      isMoveSuccess = isMoveSuccess || this.score < mergedScore;
    }, console.error, () => {
      if (this.isGameOver) return;
      if (isMoveSuccess) this.gameService.randomizeGame();
      this.score = this.gameService.score;
      this.isGameOver = this.gameService.isGameOver;
    });
  }

  // Keyboard controls handler
  @HostListener('window:keyup', ['$event'])
  handleKeyboardControls(event: KeyboardEvent) {
    const direction = KEYCODE[event.keyCode];
    this.handleParticularDirection(direction);
  }

  // Button controls
  handleButtonControls(keyCode: number) {
    const direction = KEYCODE[keyCode];
    this.handleParticularDirection(direction);
  }

  handleMouseSwipe(event) {
    const directionX = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? Direction.RIGHT : Direction.LEFT) : null;
    const directionY = Math.abs(event.deltaY) > 40 ? (event.deltaY > 0 ? Direction.DOWN : Direction.UP) : null;
    if (directionY || directionY == 0)
      this.handleParticularDirection(directionY);
    else if (directionX)
      this.handleParticularDirection(directionX);
    else
      return;
  }

  initializePlayboard() {
    this.tiles = this.gameService.tiles;
    this.isGameOver = false;
    this.isGameCompleted = false;
    this.gameService.randomizeGame();
    this.tiles.map(tile => tile.success.subscribe(this.successHandler));
  }

  restartPlayboard() {
    this.score = 0;
    this.gameService.restartGame();
    this.initializePlayboard();
    this.refreshLastTenScores();
  }

  successHandler = () => {
    this.isGameCompleted = true;
    this.isGameOver = true;
  }

  refreshLastTenScores() {
    this.lastTenScores = this.gameService.lastTenScores;
    if (this.lastTenScores.length > 10) {
      this.lastTenScores = this.lastTenScores.splice(this.lastTenScores.length - 10, 10);
    }
    this.lastTenScores = this.lastTenScores.sort((a, b) => b - a);
  }

  onSaveScore() {
    this.gameService.saveData(this.gameService.score);
    this.gameService.loadData();
    this.refreshLastTenScores();
  }
}
