import { NgModule } from "@angular/core";
import { JwtService } from "./services/jwt.service";
import { RequestService } from "./services/request.service";
import { WebSocketService } from "./services/web-socket.service";
import { UserGuard } from "./guards/auth-user.guard";
import { ManagerGuard } from "./guards/auth-manager.guard";
import { AppModule } from "src/app/app.module";

@NgModule({
  declarations: [],
  imports: [],
  providers: [JwtService, RequestService, WebSocketService, UserGuard, ManagerGuard],
  exports: []
})
export class CommonModule { }