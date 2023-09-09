import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { RoomComponent } from './components/room/room/room.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomsListComponent,
    NavBarComponent,
    HeaderComponent,
    RoomComponent
  ],
  imports: [
    CommonModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
