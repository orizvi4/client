import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { RoomComponent } from './components/room/room.component';
import { ChannelComponent } from './components/room/channel/channel.component';

const routes: Routes = [
    {path:'live',component:RoomsListComponent},
    {path:'live/room',component:RoomComponent},
    {path:'live/room/channel',component:ChannelComponent},
    {path:'',redirectTo: 'live', pathMatch: "full"}
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
