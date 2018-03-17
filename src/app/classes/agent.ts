import {User} from './user';
import {Address} from './address';
import {Marker} from 'leaflet';
import * as L from 'leaflet';

export class Agent extends User {
  static agentIcon?: L.Icon = L.icon({
    iconUrl: '/assets/profil.png',
    iconSize: [38, 95],
  });
  public static color? = '#BDBDBD';
  latitude: number;
  longitude: number;
  layer_id?: number;
  marker?: Marker;
  constructor(latitude: number, longitude: number, id: string, username: string, first_name: string, last_name: string, entitle: string, usertype: string, password: string, zonerights: string, address: Address, teamright = null, siteright = null, picture = null, team = null) {
    super(id, username, first_name, last_name, entitle, usertype, password, zonerights, address, teamright, siteright, picture, team);
    this.latitude = latitude;
    this.longitude = longitude;
  }
  public static agentToMarker(agent: Agent): Marker {
    if (agent.latitude && agent.longitude && agent.team && agent.usertype) {
      const marker = L.marker([agent.latitude, agent.longitude], {icon: this.agentIcon});
      marker.bindPopup('<b> Username : ' + agent.username +
        '</b><br> Team : ' + agent.team +
        '</br> Type : ' + agent.usertype);
      agent.marker = marker;
      return marker;
    } else {
      console.error('Driver/Enforcer marker : error while reading data object.');
    }
  }
  public updatePosition(agent: Agent) {
    if (agent.id === this.id) {
      if (agent.latitude !== this.latitude || agent.longitude !== this.longitude) {
        this.latitude = agent.latitude;
        this.longitude = agent.longitude;
        console.log('position updated for ' + this.username);
      }
    }
    return this;
  }
}

