import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";

const kv = createClient({ url: process.env.REDIS_URL });
kv.connect().catch(console.error);

kv.on("error", (error: Error) => {
  console.error(error.message);
});

kv.on("connect", function () {
  console.log(`Redis connected at ${process.env.REDIS_URL}`);
});

const redisStore = new RedisStore({
  sendCommand: (...args: string[]) => kv.sendCommand(args),
});

export { redisStore };
