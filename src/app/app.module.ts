import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayboardModule } from './playboard/playboard.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PlayboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
