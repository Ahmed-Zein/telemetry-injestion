// cypod-telemetry
export const alertThresholds = {
  lowBatteryPercent: Number(process.env.LOW_BATTERY_THRESHOLD) || 15,
  highTemperatureCelsius: Number(process.env.HIGH_TEMPERATURE_THRESHOLD) || 45,
};
