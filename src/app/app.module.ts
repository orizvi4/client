import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { RoomBoxComponent } from './components/rooms-list/room-box/room-box.component';
import { RequestService } from '../common/services/request.service';
import { Constants } from '../common/constants';
import { AppRoutingModule } from './app-routing.module';
import { RoomComponent } from './components/room/room.component';
import { ChannelComponent } from './components/room/channel/channel.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { UserManagerComponent } from './components/user-manager/user-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomsListComponent,
    NavBarComponent,
    HeaderComponent,
    RoomBoxComponent,
    RoomComponent,
    ChannelComponent,
    ArchiveComponent,
    UserManagerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [RequestService, Constants],
  bootstrap: [AppComponent]
})
export class AppModule { }
