// cypod-telemetry
export const en = {
  // Auth
  "auth.token_missing": "Authentication failed: Token missing or malformed.",
  "auth.token_invalid": "Invalid or expired token.",
  "auth.required": "Authentication required.",

  // Devices
  "device.not_found": "Device not found",
  "device.name_exists": "Name already exists for this user",
  "device.invalid_id": "Invalid device id",
  "device.created": "Device created successfully",

  // Telemetry
  "telemetry.empty_payload": "Telemetry payload cannot be empty",
  "telemetry.invalid_date": "Invalid '{label}' date format: {value}",
  "telemetry.date_out_of_range": "'{label}' date is out of reasonable range: {value}",

  // User
  "user.already_exists": "User already exists",
  "user.invalid_credentials": "Invalid credentials",

  // General
  "success.default": "Request successful",
  "error.route_not_found": "Route {url} not found",
  "error.internal_server": "Internal Server Error",
  "error.validation_failed": "Validation failed: {details}",
  "error.payload_too_large": "Request body is larger than the {limit} limit. Send a smaller batch.",
  "error.malformed_json": "Request body is not valid JSON",
  "error.rate_limited": "Rate limit exceeded: at most {limit} requests per window. Retry in {retryAfter}s.",
} as const;
