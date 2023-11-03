// import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
// import { Observable } from "rxjs";
// import { RequestService } from "../services/request.service";
// import { UserDTO } from "../models/userDTO.interface";


// export class ManagerGuard implements CanActivate {
//     constructor(private requestService: RequestService) {}
//     async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        
//         const res: string | UserDTO = await this.requestService.authenticateUser(this.username.nativeElement.value, this.password.nativeElement.value);
//     }
// }