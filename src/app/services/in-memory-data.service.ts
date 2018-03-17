import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable()
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const users = [
      { username: 'Selim2ez', firstname: 'Selim', lastname: 'Ammari', entitle: '', usertype: 'Admin', zones: 'All', address: '8 avenue des champs Elysées', zip_code: 75008, city: 'Paris', state: 'France' },
      { username: 'Selim2ez', firstname: 'Selim', lastname: 'Ammari', entitle: '', usertype: 'Admin', zones: 'All', address: '8 avenue des champs Elysées', zip_code: 75008, city: 'Paris', state: 'France' },
      { username: 'Selim2ez', firstname: 'Selim', lastname: 'Ammari', entitle: '', usertype: 'Admin', zones: 'All', address: '8 avenue des champs Elysées', zip_code: 75008, city: 'Paris', state: 'France' },
      { username: 'Selim2ez', firstname: 'Selim', lastname: 'Ammari', entitle: '', usertype: 'Admin', zones: 'All', address: '8 avenue des champs Elysées', zip_code: 75008, city: 'Paris', state: 'France' },
      { username: 'Selim2ez', firstname: 'Selim', lastname: 'Ammari', entitle: '', usertype: 'Admin', zones: 'All', address: '8 avenue des champs Elysées', zip_code: 75008, city: 'Paris', state: 'France' },
      { username: 'Selim2ez', firstname: 'Selim', lastname: 'Ammari', entitle: '', usertype: 'Admin', zones: 'All', address: '8 avenue des champs Elysées', zip_code: 75008, city: 'Paris', state: 'France' },
      { username: 'Selim2ez', firstname: 'Selim', lastname: 'Ammari', entitle: '', usertype: 'Admin', zones: 'All', address: '8 avenue des champs Elysées', zip_code: 75008, city: 'Paris', state: 'France' },
      { username: 'Selim2ez',  firstname: 'Selim', lastname: 'Ammari', entitle: '', usertype: 'Admin', zones: 'All', address: '8 avenue des champs Elysées', zip_code: 75008, city: 'Paris', state: 'France' }
    ];

    const vehicles = [
      { licence_plate: 'AA67809', issue_date: '11/02/1998', vehicle_type: 'Tow Truck', vehicle_brand: 'Iveco', vehicle_model: 'Daily', color: 'Black'},
      { licence_plate: 'AA67809', issue_date: '11/02/1998', vehicle_type: 'Tow Truck', vehicle_brand: 'Iveco', vehicle_model: 'Daily', color: 'Black'},
      { licence_plate: 'AA67809', issue_date: '11/02/1998', vehicle_type: 'Tow Truck', vehicle_brand: 'Iveco', vehicle_model: 'Daily', color: 'Black'},
      { licence_plate: 'AA67809', issue_date: '11/02/1998', vehicle_type: 'Tow Truck', vehicle_brand: 'Iveco', vehicle_model: 'Daily', color: 'Black'},
      { licence_plate: 'AA67809', issue_date: '11/02/1998', vehicle_type: 'Tow Truck', vehicle_brand: 'Iveco', vehicle_model: 'Daily', color: 'Black'},
      { licence_plate: 'AA67809', issue_date: '11/02/1998', vehicle_type: 'Tow Truck', vehicle_brand: 'Iveco', vehicle_model: 'Daily', color: 'Black'},
      { licence_plate: 'AA67809', issue_date: '11/02/1998', vehicle_type: 'Tow Truck', vehicle_brand: 'Iveco', vehicle_model: 'Daily', color: 'Black'},
      { licence_plate: 'AA67809', issue_date: '11/02/1998', vehicle_type: 'Tow Truck', vehicle_brand: 'Iveco', vehicle_model: 'Daily', color: 'Black'},
      { licence_plate: 'AA67809', issue_date: '11/02/1998', vehicle_type: 'Tow Truck', vehicle_brand: 'Iveco', vehicle_model: 'Daily', color: 'Black'},
      { licence_plate: 'AA67809', issue_date: '11/02/1998', vehicle_type: 'Tow Truck', vehicle_brand: 'Iveco', vehicle_model: 'Daily', color: 'Black'}
    ];

    const sites = [
      { name: 'Ville de Paris', address: '', zip_code: '75', city: 'Paris', state: 'France'},
      { name: 'Ville de Paris', address: '', zip_code: '75', city: 'Paris', state: 'France'},
      { name: 'Ville de Paris', address: '', zip_code: '75', city: 'Paris', state: 'France'},
      { name: 'Ville de Paris', address: '', zip_code: '75', city: 'Paris', state: 'France'},
      { name: 'Ville de Paris', address: '', zip_code: '75', city: 'Paris', state: 'France'},
      { name: 'Ville de Paris', address: '', zip_code: '75', city: 'Paris', state: 'France'},
      { name: 'Ville de Paris', address: '', zip_code: '75', city: 'Paris', state: 'France'},
      { name: 'Ville de Paris', address: '', zip_code: '75', city: 'Paris', state: 'France'},
      { name: 'Ville de Paris', address: '', zip_code: '75', city: 'Paris', state: 'France'}
    ];

    const zones = [
      { name: 'Zone', site_assiociated: 'Ville de Paris'},
      { name: 'Zone', site_assiociated: 'Ville de Paris'},
      { name: 'Zone', site_assiociated: 'Ville de Paris'},
      { name: 'Zone', site_assiociated: 'Ville de Paris'},
      { name: 'Zone', site_assiociated: 'Ville de Paris'},
      { name: 'Zone', site_assiociated: 'Ville de Paris'},
      { name: 'Zone', site_assiociated: 'Ville de Paris'},
      { name: 'Zone', site_assiociated: 'Ville de Paris'}
    ];

    const jobs = [
      { status: 'Pending', licence_plate: 'AA45693', brand: 'Renault', description: 'Payment not found', type: 'Tow job', creation_date: '21/02/2009', start_time: '', end_time: '', taken_by: '', zone: 'Zone A'},
      { status: 'Pending', licence_plate: 'AA45693', brand: 'Renault', description: 'Payment not found', type: 'Tow job', creation_date: '21/02/2009', start_time: '', end_time: '', taken_by: '', zone: 'Zone A'},
      { status: 'Pending', licence_plate: 'AA45693', brand: 'Renault', description: 'Payment not found', type: 'Tow job', creation_date: '21/02/2009', start_time: '', end_time: '', taken_by: '', zone: 'Zone A'},
      { status: 'Pending', licence_plate: 'AA45693', brand: 'Renault', description: 'Payment not found', type: 'Tow job', creation_date: '21/02/2009', start_time: '', end_time: '', taken_by: '', zone: 'Zone A'},
      { status: 'Pending', licence_plate: 'AA45693', brand: 'Renault', description: 'Payment not found', type: 'Tow job', creation_date: '21/02/2009', start_time: '', end_time: '', taken_by: '', zone: 'Zone A'},
      { status: 'Pending', licence_plate: 'AA45693', brand: 'Renault', description: 'Payment not found', type: 'Tow job', creation_date: '21/02/2009', start_time: '', end_time: '', taken_by: '', zone: 'Zone A'},
      { status: 'Pending', licence_plate: 'AA45693', brand: 'Renault', description: 'Payment not found', type: 'Tow job', creation_date: '21/02/2009', start_time: '', end_time: '', taken_by: '', zone: 'Zone A'},
      { status: 'Pending', licence_plate: 'AA45693', brand: 'Renault', description: 'Payment not found', type: 'Tow job', creation_date: '21/02/2009', start_time: '', end_time: '', taken_by: '', zone: 'Zone A'},
      { status: 'Pending', licence_plate: 'AA45693', brand: 'Renault', description: 'Payment not found', type: 'Tow job', creation_date: '21/02/2009', start_time: '', end_time: '', taken_by: '', zone: 'Zone A'},
      { status: 'Pending', licence_plate: 'AA45693', brand: 'Renault', description: 'Payment not found', type: 'Tow job', creation_date: '21/02/2009', start_time: '', end_time: '', taken_by: '', zone: 'Zone A'},
      { status: 'Pending', licence_plate: 'AA45693', brand: 'Renault', description: 'Payment not found', type: 'Tow job', creation_date: '21/02/2009', start_time: '', end_time: '', taken_by: '', zone: 'Zone A'}
    ];

    return {users, vehicles, sites, zones, jobs};
  }

  constructor() { }

}
