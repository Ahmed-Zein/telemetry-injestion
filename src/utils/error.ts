// cypod-telemetry
export class AppError extends Error {
  public readonly isOperational: boolean;
  public readonly messageKey: string;
  public readonly params: Record<string, string | number>;
  public readonly statusCode: number;

  constructor(
    messageKey: string,
    params: Record<string, string | number> = {},
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(messageKey);
    this.name = "AppError";
    this.messageKey = messageKey;
    this.params = params;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError extends AppError {
  constructor(messageKey: string, params?: Record<string, string | number>) {
    super(messageKey, params, 400);
    this.name = "BadRequestError";
  }
}

export class AuthenticationError extends AppError {
  constructor(messageKey: string, params?: Record<string, string | number>) {
    super(messageKey, params, 401);
    this.name = "AuthenticationError";
  }
}

export class ForbiddenError extends AppError {
  constructor(messageKey: string, params?: Record<string, string | number>) {
    super(messageKey, params, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(messageKey: string, params?: Record<string, string | number>) {
    super(messageKey, params, 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(messageKey: string, params?: Record<string, string | number>) {
    super(messageKey, params, 409);
    this.name = "ConflictError";
  }
}
