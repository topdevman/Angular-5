export class Vehicle {
  id: string;
  brand: string;
  color: string;
  issuedate: string;
  licence_plate: string;
  model: string;
  type: string;


  constructor(id: string, brand: string, color: string, issuedate: string, licence_plate: string, model: string, type: string) {
    this.id = id;
    this.brand = brand;
    this.color = color;
    this.issuedate = issuedate;
    this.licence_plate = licence_plate;
    this.model = model;
    this.type = type;
  }
}
