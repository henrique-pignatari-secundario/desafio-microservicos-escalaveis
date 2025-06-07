import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "canceled"]);

export const invoices = pgTable("invoices", {
  id: text().primaryKey(),
  orderId: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
