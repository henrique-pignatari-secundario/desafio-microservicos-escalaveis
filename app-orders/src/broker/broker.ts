import amqp from "amqplib";

const brokerUrl = process.env.BROKER_URL;
if (!brokerUrl) throw new Error("BROKER_URL must be configured.");

export const broker = await amqp.connect(brokerUrl);
