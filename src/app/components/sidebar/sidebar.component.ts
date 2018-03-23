import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {AccessRightsService} from "../../services/accessRights.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(protected authService: AuthService,
              private accessRightsService: AccessRightsService,
              protected router: Router) { }

  ngOnInit() {
  }

  canView = this.accessRightsService.canView;

}

