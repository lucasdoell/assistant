import { authRouter as v1AuthRouter } from "@/v1/auth/routes";
import RedisStore from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import { createClient } from "redis";

const app = express();
app.set("trust proxy", 1);

const kv = createClient({
  url: process.env.REDIS_URL,
});

kv.connect().catch(console.error);

const redisStore = new RedisStore({
  client: kv,
  prefix: "auth:",
  disableTouch: true,
});

kv.on("error", (error: Error) => {
  console.error(error.message);
});

kv.on("connect", function () {
  console.log(`Redis connected at ${process.env.REDIS_URL}`);
});

app.use(
  cors({
    origin: (origin, callback) => {
      const origins = String(process.env.CORS_ORIGIN).split(",");
      if (!origin || origins.includes(String(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed."), false);
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(
  session({
    name: process.env.SESSION_COOKIE_NAME,
    secret: String(process.env.SESSION_SECRET),
    store: redisStore as any,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    },
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (_req, res) => res.send("Hello from Express!"));

app.use("/v1/auth", v1AuthRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}...`);
});
