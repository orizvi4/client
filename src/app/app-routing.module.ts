import { NgModule } from '@angular/core';
import { Routes, RouterModule, mapToCanActivate } from '@angular/router';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { RoomComponent } from './components/room/room.component';
import { ChannelComponent } from './components/room/components/channel/channel.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { UserManagerComponent } from './components/user-manager/user-manager.component';
import { LoginComponent } from './components/login/login.component';
import { LogsDisplayComponent } from './components/logs-display/logs-display.component';
import { ManagerGuard } from 'src/common/guards/auth-manager.guard';
import { UserGuard } from 'src/common/guards/auth-viewer.guard';

const routes: Routes = [
    {path:'live', component:RoomsListComponent, canActivate: [UserGuard]},
    {path:'live/room',component:RoomComponent, canActivate: [UserGuard]},
    {path:'live/room/channel',component:ChannelComponent, canActivate: [UserGuard]},
    {path:'archive',component:ArchiveComponent, canActivate: [UserGuard]},
    {path:'userManager',component:UserManagerComponent, canActivate: [ManagerGuard]},
    {path:'login',component:LoginComponent},
    {path:'logsDisplay',component:LogsDisplayComponent, canActivate: [ManagerGuard]},
    {path:'',redirectTo: 'login', pathMatch: "full"}
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})
export class AppRoutingModule {}
