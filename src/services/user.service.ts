// cypod-telemetry
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../dtos/auth.dto.js";
import { User } from "../infra/db/schema.js";
import { IUserRepository } from "../repositories/user.repository.js";
import { IHashService } from "./hash.service.js";
import { IJwtService } from "./jwt.service.js";

class UserService {
  private userRepository: IUserRepository;
  private hashService: IHashService;
  private jwtService: IJwtService;

  constructor(
    userRepository: IUserRepository,
    hashService: IHashService,
    jwtService: IJwtService,
  ) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.jwtService = jwtService;
  }

  async loginUser(
    loginRequest: LoginRequest,
  ): Promise<AuthResponse | undefined> {
    const user = await this.checkValidCredentials(
      loginRequest.email,
      loginRequest.password,
    );
    if (user === undefined) {
      return undefined;
    }
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
    );
    return {
      token: accessToken,
      refreshToken: refreshToken,
    };
  }

  async checkValidCredentials(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return user;
    }
    const isPasswordValid = await this.hashService.compare(
      password,
      user.passwordHash,
    );
    return isPasswordValid ? user : undefined;
  }

  generateTokens(
    id: number,
    email: string,
  ): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.generateAccessToken({ id, email });
    const refreshToken = this.jwtService.generateRefreshToken({ id, email });
    return { accessToken, refreshToken };
  }

  async registerUser(
    registerRequest: RegisterRequest,
  ): Promise<AuthResponse | undefined> {
    // note: Add validation logic here (e.g., check if the email is already registered, validate password strength, etc.)
    const existingUser = await this.userRepository.findByEmail(
      registerRequest.email,
    );

    if (existingUser) {
      return undefined;
    }
    const passwordHash = await this.hashService.hash(registerRequest.password);

    const user = await this.userRepository.create({
      name: registerRequest.name,
      email: registerRequest.email,
      passwordHash,
    });

    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
    );

    return {
      token: accessToken,
      refreshToken: refreshToken,
    };
  }
}

export default UserService;
