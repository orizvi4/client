import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { RoomComponent } from './components/room/room.component';
import { ChannelComponent } from './components/room/channel/channel.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { UserManagerComponent } from './components/user-manager/user-manager.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
    {path:'live',component:RoomsListComponent},
    {path:'live/room',component:RoomComponent},
    {path:'live/room/channel',component:ChannelComponent},
    {path:'archive',component:ArchiveComponent},
    {path:'userManager',component:UserManagerComponent},
    {path:'login',component:LoginComponent},
    {path:'',redirectTo: 'login', pathMatch: "full"}
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
