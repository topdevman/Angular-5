import {Address} from './address';

export class User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  entitle: string;
  usertype: string;
  password: string;
  zonerights: string;
  teamright?: string;
  siteright?: string;
  picture?: string;
  address: Address;
  team?: string;
  selected?: boolean;
  site_id: string;


  constructor(id: string, username: string, first_name: string, last_name: string, entitle: string, usertype: string,
              password: string, zonerights: string, address: Address, site_id: string, teamright = null, siteright = null, picture = null,
              team = null) {
    this.id = id;
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.entitle = entitle;
    this.usertype = usertype;
    this.password = password;
    this.zonerights = zonerights;
    this.address = address;
    this.teamright = teamright;
    this.siteright = siteright;
    this.picture = picture;
    this.team = team;
    this.site_id = site_id;
  }
}

