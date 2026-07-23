import {
  integer,
  pgTable,
  varchar,
  timestamp,
  unique,
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
    userId: integer()
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [unique("user_device_name_unique").on(table.userId, table.name)],
);

export type Device = typeof devicesTable.$inferSelect;
export type NewDevice = typeof devicesTable.$inferInsert;
