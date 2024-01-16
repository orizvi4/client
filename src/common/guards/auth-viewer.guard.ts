import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, Router, CanActivate } from "@angular/router";
import { JwtService } from "../services/jwt.service";
import Swal from "sweetalert2";
import { AppComponent } from "src/app/app.component";


@Injectable({ providedIn: "root" })
export class UserGuard implements CanActivate {
    constructor(private jwtService: JwtService, private router: Router) { }

    public async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        try {
            return await this.jwtService.verifyToken();
        }
        catch (err) {
            await Swal.fire({
                icon: 'error',
                title: 'page unauthorized',
                text: 'you are not allowed on this page'
            });
            // await this.appComponent.signOut();
            // this.router.navigate(['/login']);
            return false
        }
    }
}