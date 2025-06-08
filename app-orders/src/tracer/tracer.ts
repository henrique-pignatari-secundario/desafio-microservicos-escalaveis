import { trace } from "@opentelemetry/api";

const tracerServiceName = process.env.OTEL_SERVICE_NAME;
if (!tracerServiceName) throw new Error("OTEL_SERVICE_NAME must be configured");

export const tracer = trace.getTracer(tracerServiceName);
