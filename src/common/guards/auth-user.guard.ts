import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, Router, CanActivate } from "@angular/router";
import { JwtService } from "../services/jwt.service";
import Swal from "sweetalert2";
import { AppComponent } from "src/app/app.component";
import { Location } from "@angular/common";


@Injectable({ providedIn: "root" })
export class UserGuard implements CanActivate {
    constructor(private jwtService: JwtService, private router: Router, private location: Location) { }

    public async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        try {
            return await this.jwtService.verifyUrl();
        }
        catch (err) {
            this.router.navigate(['/**']);
            return false
        }
    }
}