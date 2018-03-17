import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from '../services/auth.service';
import {AccessRightsService} from "../services/accessRights.service";

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private authService: AuthService,
              private accessRightsService: AccessRightsService) {

  }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      let loggedInUser:any = this.authService.getLoggedInUser();
      if (!this.accessRightsService.userAccessRights && loggedInUser && loggedInUser.site_id) {
        this.accessRightsService.getRightsBySiteIdAndUserId(loggedInUser.site_id, loggedInUser.id).subscribe((data:any) => {
          this.accessRightsService.userAccessRights = data.rights;
          resolve(true);
        });
      } else {
        resolve(true);
      }
    })
  }
}
