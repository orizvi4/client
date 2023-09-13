import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { RoomComponent } from './components/room/room.component';

const routes: Routes = [
    {path:'roomsList',component:RoomsListComponent},
    {path:'room',component:RoomComponent},
    {path:'',redirectTo: 'roomsList', pathMatch: "full"}
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
