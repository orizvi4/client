import { NgModule, forwardRef } from "@angular/core";
import { JwtService } from "./services/jwt.service";
import { RequestService } from "./services/request.service";
import { WebSocketService } from "./services/web-socket.service";
import { UserGuard } from "./guards/auth-viewer.guard";
import { ManagerGuard } from "./guards/auth-manager.guard";

@NgModule({
    declarations: [],
    imports: [],
    providers: [JwtService, RequestService, WebSocketService, UserGuard, ManagerGuard],
})
export class CommonModule { }