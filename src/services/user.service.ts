import User from "../models/user.model.js";
import UserRepository from "../repositories/user.repository.js";

class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  loginUser(email: string, password: string): boolean {
    const user = this.userRepository.getUserByEmail(email);
    if (user && user.password === password) {
      return true;
    }
    return false;
  }

  registerUser(user: User): boolean {
    // TODO: Add validation logic here (e.g., check if the email is already registered, validate password strength, etc.)
    const existingUser = this.userRepository.getUserByEmail(user.email);
    if (existingUser) {
      return false;
    }
    return true;
  }
}

export default UserService;
