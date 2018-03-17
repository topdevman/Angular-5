export class Team {
  id: string;
  typeteam: string;
  members: string[];

  constructor(id: string, typeteam: string, members: string[]) {
    this.id = id;
    this.typeteam = typeteam;
    this.members = members;
  }

}
