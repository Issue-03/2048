import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Tile } from '../models/tile.model';
import { Direction } from '../models/direction';
import { MOVE_CONTROLLER } from '../util/move.controller';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  tiles: Tile[] = Array(16).fill(null).map(_ => new Tile());
  score: number = 0;
  rows: Tile[][] = [];
  columns: Tile[][] = [];
  lastTenScores: number[] = [];

  constructor() { this.initializeGame(); }

  private getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private areTilesEqual = (tile1: Tile, tile2: Tile) => tile1.value === tile2.value;

  private hasMoves() {
    const col1 = this.columns[0];
    const col2 = this.columns[1];
    const col3 = this.columns[2];
    const col4 = this.columns[3];

    // if any adjacent tiles are equal in columns
    // then up or down move is possible
    const hasColumnMoves =
      this.areTilesEqual(col1[0], col1[1]) || this.areTilesEqual(col1[1], col1[2]) || this.areTilesEqual(col1[2], col1[3]) ||
      this.areTilesEqual(col2[0], col2[1]) || this.areTilesEqual(col2[1], col2[2]) || this.areTilesEqual(col2[2], col2[3]) ||
      this.areTilesEqual(col3[0], col3[1]) || this.areTilesEqual(col3[1], col3[2]) || this.areTilesEqual(col3[2], col3[3]) ||
      this.areTilesEqual(col4[0], col4[1]) || this.areTilesEqual(col4[1], col4[2]) || this.areTilesEqual(col4[2], col4[3]);

    // if column has moves 
    if (hasColumnMoves) return true;

    const row1 = this.rows[0];
    const row2 = this.rows[1];
    const row3 = this.rows[2];
    const row4 = this.rows[3];

    // if any adjacent tiles are equal in rows
    // then left or right move is possible
    const hasRowMoves =
      this.areTilesEqual(row1[0], row1[1]) || this.areTilesEqual(row1[1], row1[2]) || this.areTilesEqual(row1[2], row1[3]) ||
      this.areTilesEqual(row2[0], row2[1]) || this.areTilesEqual(row2[1], row2[2]) || this.areTilesEqual(row2[2], row2[3]) ||
      this.areTilesEqual(row3[0], row3[1]) || this.areTilesEqual(row3[1], row3[2]) || this.areTilesEqual(row3[2], row3[3]) ||
      this.areTilesEqual(row4[0], row4[1]) || this.areTilesEqual(row4[1], row4[2]) || this.areTilesEqual(row4[2], row4[3]);

    return hasRowMoves;
  }

  private getEmptyTiles(): Tile[] {
    return this.tiles.reduce((acc: Tile[], tile) => {
      if (tile.isEmpty) acc.push(tile);
      return acc;
    }, []);
  }

  // if player has no moves and there is no empty tile
  // then game is over
  get isGameOver(): boolean { return !this.hasMoves() && this.getEmptyTiles().length === 0 }

  initializeGame() {
    this.columns = [
      [this.tiles[0], this.tiles[4], this.tiles[8], this.tiles[12]],
      [this.tiles[1], this.tiles[5], this.tiles[9], this.tiles[13]],
      [this.tiles[2], this.tiles[6], this.tiles[10], this.tiles[14]],
      [this.tiles[3], this.tiles[7], this.tiles[11], this.tiles[15]],
    ];

    this.rows = [
      [this.tiles[0], this.tiles[1], this.tiles[2], this.tiles[3]],
      [this.tiles[4], this.tiles[5], this.tiles[6], this.tiles[7]],
      [this.tiles[8], this.tiles[9], this.tiles[10], this.tiles[11]],
      [this.tiles[12], this.tiles[13], this.tiles[14], this.tiles[15]],
    ];
  }

  restartGame() {
    this.saveData(this.score);
    this.loadData();
    this.tiles = Array(16).fill(null).map(_ => new Tile());
    this.score = 0;
    this.initializeGame();
  }

  moveTiles(direction: Direction): Observable<any> {
    return MOVE_CONTROLLER[direction](direction === Direction.LEFT || direction === Direction.RIGHT ? this.columns : this.rows).pipe(
      map((mergedScore: number) => { this.score += mergedScore; return this.score; }));
  }

  randomizeGame() {
    const emptyTiles: Tile[] = this.getEmptyTiles();
    if (emptyTiles.length === 0) return;
    const randomIndex = this.getRandomNumber(0, emptyTiles.length - 1);
    const randomValue = this.getRandomNumber(1, 2) === 1 ? 2 : 4;
    emptyTiles[randomIndex].value = randomValue;
  }

  loadData(key = "lastTenScores") {
    if (localStorage) {
      if (key in localStorage) {
        this.lastTenScores = JSON.parse(localStorage.getItem(key));
      }
    } else {
      alert("Sorry, Your browser does not support localStorage API.");
    }
  }

  saveData(score: number, key = "lastTenScores") {
    if (localStorage) {
      if (key in localStorage) {
        this.lastTenScores = JSON.parse(localStorage.getItem(key));
      }
      this.lastTenScores.push(score);
      localStorage.setItem(key, JSON.stringify(this.lastTenScores));
    } else {
      alert("Sorry, Your browser does not support localStorage API.");
    }
  }
}
