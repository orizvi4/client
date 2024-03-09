import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '../common/common.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RoomsListComponent } from './components/main/components//rooms-list/rooms-list.component';
import { NavBarComponent } from './components/main/components//nav-bar/nav-bar.component';
import { HeaderComponent } from './components/main/components//header/header.component';
import { RoomBoxComponent } from './components/main/components//rooms-list/components/room-box/room-box.component';
import { RequestService } from '../common/services/request.service';
import { Constants } from '../common/constants';
import { AppRoutingModule } from './app-routing.module';
import { RoomComponent } from './components/main/components//room/room.component';
import { ChannelComponent } from './components/main/components//room/components/channel/channel.component';
import { ArchiveComponent } from './components/main/components//archive/archive.component';
import { UserManagerComponent } from './components/main/components//user-manager/user-manager.component';
import { LoginComponent } from './components/login/login.component';
import { UserCardComponent } from './components/main/components//nav-bar/components/user-card/user-card.component';
import { UploadFormComponent } from './components/main/components//archive/components/upload-form/upload-form.component';
import { LogsDisplayComponent } from './components/main/components//logs-display/logs-display.component';
import { JwtService } from 'src/common/services/jwt.service';
import { RecordingBoxComponent } from './components/main/components//archive/components/recording-box/recording-box.component';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { UserStrikeComponent } from './components/main/components//user-manager/components/user-strike/user-strike.component';
import { MainComponent } from './components/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatPaginatorHarness} from '@angular/material/paginator/testing';

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
    UserManagerComponent,
    LoginComponent,
    UserCardComponent,
    UploadFormComponent,
    LogsDisplayComponent,
    RecordingBoxComponent,
    UserStrikeComponent,
    MainComponent,
    PageNotFoundComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  providers: [Constants, MainComponent, NavBarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
