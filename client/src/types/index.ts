// cypod-telemetry

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Device {
  id: number;
  name: string;
  ownerId: number;
  createdAt: string;
  status?: DeviceStatus;
  lastSeen?: string;
}

export type DeviceStatus = "OK" | "FAULT" | "OFFLINE";

export interface TelemetryReading {
  deviceId: string;
  battery: number;
  temperature: number;
  lat: number | null;
  lng: number | null;
  status: DeviceStatus;
  timestamp: string;
  receivedAt?: string;
}

export interface DeviceLatest {
  deviceId: string;
  battery: number;
  temperature: number;
  lat: number | null;
  lng: number | null;
  status: DeviceStatus;
  timestamp: string;
  cacheSource: "HIT" | "MISS";
}

export interface TelemetryHistory {
  items: TelemetryReading[];
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type AlertSeverity = "info" | "warning" | "critical";
export type AlertType = "LOW_BATTERY" | "HIGH_TEMPERATURE" | "DEVICE_FAULT" | "DEVICE_OFFLINE";

export interface Alert {
  id: number;
  deviceId: number;
  name?: string;
  type: AlertType;
  message: string;
  triggerValue?: number;
  thresholdValue?: number;
  triggeredAt: string;
  active: boolean;
  createdAt: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export type Locale = "en" | "ar";
