// cypod-telemetry

export const AlertTypes = {
    LOW_BATTERY: "LOW_BATTERY",
    HIGH_TEMPERATURE: "HIGH_TEMPERATURE",
} as const;

export type AlertType = (typeof AlertTypes)[keyof typeof AlertTypes];