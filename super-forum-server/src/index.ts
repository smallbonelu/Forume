import cors from "cors";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import { createConnection } from "typeorm";
import bodyParser from "body-parser";
import { login, logout, register } from "./repo/UserRepo";
import { createThread } from "./repo/ThreadRepo";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import typeDefs from "./gql/typeDefs";
import resolvers from "./gql/resolvers";

declare module "express-session" {
  export interface SessionData {
    userId: any;
    loadedCount: Number;
  }
}

dotenv.config();

const main = async () => {
  const app = express();
  console.log("client url", process.env.CLIENT_URL);
  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
    })
  );
  const router = express.Router();
  await createConnection();

  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  });

  const RedisStore = connectRedis(session);
  const redisStore = new RedisStore({
    client: redis,
  });

  app.use(bodyParser.json());

  app.use(
    session({
      store: redisStore,
      name: process.env.COOKIE_NAME,
      sameSite: "Strict",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
      },
    } as any)
  );
  app.use(router);

  router.get("/", (req, res, next) => {
    if (!req.session!.userId) {
      req.session!.userId = req.query.userid;
      console.log("User id is set");
      req.session!.loadedCount = 0;
    } else {
      req.session!.loadedCount = Number(req.session!.loadedCount) + 1;
    }

    res.send(
      `userid: ${req.session!.userId}, loadedCount: ${req.session!.loadedCount}`
    );
    next();
  });

  router.post("/register", async (req, res, next) => {
    try {
      console.log("params", req.body);
      const { email, userName, password } = req.body;
      const userResult = await register(email, userName, password);
      if (userResult && userResult.user) {
        res.send(`new user created, userId: ${userResult.user.id}`);
      } else if (userResult && userResult.messages) {
        res.send(userResult.messages[0]);
      } else {
        next();
      }
    } catch (error) {
      res.send(error.message);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      console.log("params", req.body);
      const userResult = await login(req.body.userName, req.body.password);
      if (userResult && userResult.user) {
        req.session!.userId = userResult.user?.id;
        res.send(`user logged in, userId: ${req.session!.userId}`);
      } else if (userResult && userResult.messages) {
        res.send(userResult.messages[0]);
      } else {
        next();
      }
    } catch (error) {
      res.send(error.message);
    }
  });

  router.post("/logout", async (req, res, next) => {
    try {
      console.log("params", req.body);
      const msg = await logout(req.body.userName);
      if (msg) {
        req.session!.userId = null;
        res.send(msg);
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  });

  router.post("/createthread", async (req, res, next) => {
    try {
      console.log("userId", req.session);
      console.log("body", req.body);
      const { title, body, categoryId } = req.body;
      const msg = await createThread(
        req.session!.userId,
        categoryId,
        title,
        body
      );
      res.send(msg);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen({ port: process.env.SERVER_PORT }, () => {
    console.log(
      `Server ready on port ${process.env.SERVER_PORT} at ${process.env.NODE_ENV} mode.`
    );
  });
};

main();
