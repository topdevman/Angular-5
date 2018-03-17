import {Address} from './address';

export class Site {
  id: string;
  name: string;
  address: Address;
  type: string;
  project_uid: string;

  constructor(id: string, name: string, address: Address, type: string, project_uid: string) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.type = type;
    this.project_uid = project_uid;
  }
}
