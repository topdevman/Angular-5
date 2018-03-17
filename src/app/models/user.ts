export class User {
  private id: string;
  private username: string;
  private password: string;
  private firstname: string;
  private lastname: string;
  private usertype: string;
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
