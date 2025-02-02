import { timestamp } from "drizzle-orm/mysql-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const todosTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  todo: text().notNull(),
  createdAt: timestamp('created_at').defaultNow,
  updatedAt: timestamp('updated_at').$onUpdate(()=> new Date()),
});

