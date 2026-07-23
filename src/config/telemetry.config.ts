// cypod-telemetry
export const telemetryConfig = {
  minTemperature: Number(process.env.TEMPERATURE_MIN) || 0,
  maxTemperature: Number(process.env.TEMPERATURE_MAX) || 100,
  maxTimestampAgeDays: Number(process.env.TIMESTAMP_MAX_AGE_DAYS) || 30,
};
