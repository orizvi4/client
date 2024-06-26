import { NgModule } from '@angular/core';
import { Routes, RouterModule, mapToCanActivate } from '@angular/router';
import { RoomsListComponent } from './components/main/components/rooms-list/rooms-list.component';
import { RoomComponent } from './components/main/components/room/room.component';
import { ChannelComponent } from './components/main/components/room/components/channel/channel.component';
import { ArchiveComponent } from './components/main/components/archive/archive.component';
import { UserManagerComponent } from './components/main/components/user-manager/user-manager.component';
import { LoginComponent } from './components/login/login.component';
import { LogsDisplayComponent } from './components/main/components/logs-display/logs-display.component';
import { ManagerGuard } from 'src/common/guards/auth-manager.guard';
import { UserGuard } from 'src/common/guards/auth-user.guard';
import { MainComponent } from './components/main/main.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'pageNotFound', component: PageNotFoundComponent},
  {
    path: 'main', canActivate: [UserGuard], component: MainComponent, children: [
      { path: 'live/room', component: RoomComponent, canActivate: [UserGuard] },
      { path: 'live', component: RoomsListComponent, canActivate: [UserGuard] },
      { path: 'archive', component: ArchiveComponent, canActivate: [UserGuard] },
      { path: 'userManager', component: UserManagerComponent, canActivate: [ManagerGuard] },
      { path: 'logsDisplay', component: LogsDisplayComponent, canActivate: [ManagerGuard] },
      { path: '', redirectTo: 'live', pathMatch: "full" },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: "full" },
  { path: '**', redirectTo: 'pageNotFound'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
