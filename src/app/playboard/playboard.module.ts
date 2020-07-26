import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

import { PlayboardComponent } from './playboard.component';
import { TileComponent } from './tile/tile.component';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  declarations: [PlayboardComponent, TileComponent],
  imports: [
    CommonModule,
    HammerModule
  ],
  exports: [PlayboardComponent],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
})
export class PlayboardModule { }
