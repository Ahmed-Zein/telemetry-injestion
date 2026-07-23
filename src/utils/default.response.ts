// cypod-telemetry
export class DefaultResponse<T> {
  public success: boolean;
  public message?: string;
  public data?: T;
  public error?: string;

  private constructor(
    success: boolean,
    data?: T,
    message?: string,
    error?: string,
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
  }

  public static success<T>(
    data: T,
    message: string = "Request successful",
  ): DefaultResponse<T> {
    return new DefaultResponse<T>(true, data, message, undefined);
  }

  public static fail<T = never>(error: string): DefaultResponse<T> {
    return new DefaultResponse<T>(false, undefined, undefined, error);
  }
}
