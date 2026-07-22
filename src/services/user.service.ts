import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../dtos/auth.dto.js";
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
    if (
      (await this.checkValidCredentials(
        loginRequest.email,
        loginRequest.password,
      )) === false
    ) {
      return undefined;
    }
    const { accessToken, refreshToken } = this.generateTokens(
      loginRequest.email,
    );
    return {
      token: accessToken,
      refreshToken: refreshToken,
    };
  }

  async checkValidCredentials(
    email: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return false;
    }
    const isPasswordValid = await this.hashService.compare(
      password,
      user.passwordHash,
    );
    return isPasswordValid;
  }

  generateTokens(email: string): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.generateAccessToken({ email });
    const refreshToken = this.jwtService.generateRefreshToken({ email });
    return { accessToken, refreshToken };
  }

  async registerUser(
    registerRequest: RegisterRequest,
  ): Promise<AuthResponse | undefined> {
    // TODO: Add validation logic here (e.g., check if the email is already registered, validate password strength, etc.)
    const existingUser = await this.userRepository.findByEmail(
      registerRequest.email,
    );

    if (existingUser) {
      return undefined;
    }
    const passwordHash = await this.hashService.hash(registerRequest.password);

    await this.userRepository.create({
      name: registerRequest.name,
      email: registerRequest.email,
      passwordHash,
    });

    const { accessToken, refreshToken } = this.generateTokens(
      registerRequest.email,
    );

    return {
      token: accessToken,
      refreshToken: refreshToken,
    };
  }
}

export default UserService;
