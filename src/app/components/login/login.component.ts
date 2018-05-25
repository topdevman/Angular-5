import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    public projectService: ProjectService) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };

    this.authService.authenticateUser(user).subscribe(data => {
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.router.navigate(['']);
        this.projectService.getProjects()
          .subscribe(projects => {
            this.projectService.projectsList = projects;
            if (!this.projectService.activeProject) {
              this.projectService.activeProject = projects[0].id;
              this.projectService.activeProjectObject = projects[0];
              localStorage.setItem('activeProject', this.projectService.activeProject);
            } else {
              projects.forEach(project => {
                if (project.id === this.projectService.activeProject) {
                  this.projectService.activeProjectObject = project;
                }
              });
            }
          });
      } else if (this.username === undefined && this.password === undefined) {
        this.flashMessage.show('Please enter your login details', {cssClass: 'alert-warning flash-message', timeout: 5000});
        this.router.navigate(['login']);
      } else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate(['login']);
      }

    });
  }
}
