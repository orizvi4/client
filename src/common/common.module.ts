import { NgModule } from "@angular/core";
import { JwtService } from "./services/jwt.service";
import { RequestService } from "./services/request.service";
import { WebSocketService } from "./services/web-socket.service";
import { UserGuard } from "./guards/auth-viewer.guard";
import { ManagerGuard } from "./guards/auth-manager.guard";
import { CheckboxComponent } from './components/checkbox/checkbox.component';

@NgModule({
  declarations: [
    CheckboxComponent
  ],
  imports: [],
  providers: [JwtService, RequestService, WebSocketService, UserGuard, ManagerGuard],
  exports: [CheckboxComponent]
})
export class CommonModule { }