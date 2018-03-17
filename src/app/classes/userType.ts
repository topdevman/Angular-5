export class UserType {
  nametype: string;
  apprights: string[];
  viewrights: string[];

  constructor(nametype: string, apprights: string[], viewrights: string[]) {
    this.nametype = nametype;
    this.apprights = apprights;
    this.viewrights = viewrights;
  }

}
