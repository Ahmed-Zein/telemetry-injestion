import User from "../models/user.model.js";

class UserRepository {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  existsByEmail(email: string): boolean {
    return !!this.users.find((user) => user.email === email);
  }

  getUserById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}

export default UserRepository;
