// cypod-telemetry
export class AppError extends Error {
  public readonly isOperational: boolean;

  constructor(message: string, isOperational: boolean = true) {
    super(message);
    this.name = "AppError";
    this.isOperational = isOperational;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}
