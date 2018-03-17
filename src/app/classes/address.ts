export class Address {
  street: string;
  city: string;
  state: string;
  zip_code: string;

  constructor(street: string, city: string, state: string, zip_code: string) {
    this.street = street;
    this.city = city;
    this.state = state;
    this.zip_code = zip_code;
  }
}
