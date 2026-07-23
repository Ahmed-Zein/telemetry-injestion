// cypod-telemetry
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export const devicesTable = pgTable(
  "devices",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    ownerId: integer()
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique("user_device_name_unique").on(table.ownerId, table.name)],
);

export type Device = typeof devicesTable.$inferSelect;
export type NewDevice = typeof devicesTable.$inferInsert;

export const telemetryTable = pgTable(
  "telemetry",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    deviceId: integer()
      .notNull()
      .references(() => devicesTable.id, {
        onDelete: "cascade",
      }),
    battery: doublePrecision("battery").notNull(),
    temperature: doublePrecision("temperature").notNull(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    status: varchar("status", { length: 64 }).notNull(),

    // note: storing both the timestamp of the telemetry and the createdAt to migitate the out of order messages
    timestamp: timestamp("timestamp").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("ix_telemetry_deviceId_timestamp_idx").on(
      table.deviceId,
      table.timestamp,
    ),
  ],
);

export type Telemetry = typeof telemetryTable.$inferSelect;
export type NewTelemetry = typeof telemetryTable.$inferInsert;

export const alertsTable = pgTable("alerts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deviceId: integer()
    .notNull()
    .references(() => devicesTable.id, {
      onDelete: "cascade",
    }),
  type: varchar("type", { length: 32 }).notNull(),
  message: varchar("message", { length: 255 }).notNull(),
  triggerValue: doublePrecision("trigger_value").notNull(),
  thresholdValue: doublePrecision("threshold_value").notNull(),
  triggeredAt: timestamp("triggered_at").notNull(), // note: this is the time stamp of the telemtery, decied to denormalize it for faster reads
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Alert = typeof alertsTable.$inferSelect;
export type NewAlert = typeof alertsTable.$inferInsert;
