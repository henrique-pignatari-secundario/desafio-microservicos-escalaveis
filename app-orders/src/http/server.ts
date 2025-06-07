import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { channels } from "../broker/channels/index.ts";
import fastifyCors from "@fastify/cors";
import { schema } from "../db/schema/index.ts";
import { db } from "../db/client.ts";
import { randomUUID } from "node:crypto";
import { error } from "node:console";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, { origin: "*" });

app.get("/health", () => {
  return "OK";
});

app.post(
  "/orders",
  {
    schema: {
      body: z.object({
        amount: z.coerce.number(),
      }),
    },
  },
  async (request, reply) => {
    const { amount } = request.body;
    const orderId = randomUUID();

    await db.insert(schema.orders).values([
      {
        id: orderId,
        customerId: "c407ba7f-3357-4bc1-addf-1d8eba1c6edd",
        amount,
      },
    ]);

    dispatchOrderCreated({
      orderId,
      amount,
      customer: {
        id: "c407ba7f-3357-4bc1-addf-1d8eba1c6edd",
      },
    });
    return reply.status(201).send();
  }
);

app
  .listen({
    host: "0.0.0.0",
    port: 3333,
  })
  .then(() => {
    console.log("[Orders] HTTP Server running!");
  });
