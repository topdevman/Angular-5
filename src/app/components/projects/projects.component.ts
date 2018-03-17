import {Component, OnInit, ViewChild} from '@angular/core';
import { Project } from '../../classes/project';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef} from '@angular/material';
import {Site} from '../../classes/site';
import {ProjectService} from '../../services/project.service';
import {SitesSelectorComponent} from '../modals/sites-selector/sites-selector.component';
import {AccessRightsService} from "../../services/accessRights.service";


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {

  @ViewChild('table') ngTable;
  projects: Project[];
  newProject: Project = new Project(null, []);
  sites: Array<Site>;
  selectedProject: Project = new Project(null, []);
  dialogRef: MatDialogRef<SitesSelectorComponent>;

  displayedColumns = ['name',
    'sites', 'actions'];
  dataSource: MatTableDataSource<Project>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  getProjects(): void {

    this.projectService.getProjects()
      .subscribe(projects => {
        this.projects = projects;
        // Assign the data to the data source for the table to render
        this.featchMatTable(this.projects);
      });
  }

  onSelect(project: Project): void {
    this.selectedProject = project;
  }
  trimObject(obj: any) {
    for (const key of Object.keys(obj)) {
      if (obj[key] && (typeof obj[key] === 'string')) {
        obj[key] = obj[key].trim();
      }
    }
  }
  featchMatTable(projects: Project[]): void {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.projects);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selectedProject = this.projects ? this.projects[0] : null;
  }

  selectSites(project: Project): void {
    this.dialogRef = this.dialog.open(SitesSelectorComponent, {
      width: '50%',
      data: {
        sites: project.sites || [],
        projectId: project.id || null
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) project.sites = result;
    });
  }
  add(): void {
    this.trimObject(this.newProject);
    this.projectService.addProject(this.newProject)
      .subscribe(projectResult => {
        this.getProjects();
        this.ngTable.select('projectslist');
      });
    this.newProject = new Project(null, []);
  }

  save(): void {
    this.trimObject(this.selectedProject);
    this.projectService.updateProject(this.selectedProject)
      .subscribe(projectResult => {
        this.getProjects();
      });
    this.newProject = new Project(null, []);
  }

  delete(project: Project): void {
    if (window.confirm('Are sure you want to delete this item ?')) {
      this.projectService.deleteProject(project).subscribe(result => {
        const index = this.projects.map(item => item.id).indexOf(project.id);
        if (index > -1) {
          this.projects.splice(index, 1);
          this.featchMatTable(this.projects);
        }
      });
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  showSites(sites: any[]): string {
    sites = sites || [];
    return sites.map(item => item.name).join(', ');
  }


  constructor(private projectService: ProjectService,
              private dialog: MatDialog,
              private accessRightsService: AccessRightsService
  ) { }

  ngOnInit(): void {
    this.getProjects();
  }


}
