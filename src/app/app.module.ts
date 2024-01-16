import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '../common/common.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { RoomBoxComponent } from './components/rooms-list/components/room-box/room-box.component';
import { RequestService } from '../common/services/request.service';
import { Constants } from '../common/constants';
import { AppRoutingModule } from './app-routing.module';
import { RoomComponent } from './components/room/room.component';
import { ChannelComponent } from './components/room/components/channel/channel.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { UserManagerComponent } from './components/user-manager/user-manager.component';
import { LoginComponent } from './components/login/login.component';
import { UserCardComponent } from './components/nav-bar/components/user-card/user-card.component';
import { UploadFormComponent } from './components/archive/components/upload-form/upload-form.component';
import { LogsDisplayComponent } from './components/logs-display/logs-display.component';
import { JwtService } from 'src/common/services/jwt.service';
import { RecordingBoxComponent } from './components/archive/components/recording-box/recording-box.component';
import { WebSocketService } from 'src/common/services/web-socket.service';

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
    RecordingBoxComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [Constants],
  bootstrap: [AppComponent]
})
export class AppModule { }
