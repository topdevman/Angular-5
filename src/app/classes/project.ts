export class Project {
  id: string;
  name: string;
  sites: any[];

  constructor(name: string, sites: any[], id?: string) {
    this.sites = sites;
    this.name = name;
    this.id = id;
  }
}
