import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { userController } from "@/controllers/user";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(
    swagger({
      exclude: ["/swagger"],
      autoDarkMode: true,
      documentation: {
        info: {
          title: "JobTP",
          description: "Elysia Documentation",
          version: "0.0.1",
          license: {
            name: "MIT",
            url: "https://opensource.org/license/mit/",
          },
        },
      },
    })
  )
  .get("/", ({ path }) => path)
  .use(userController)
  .listen(8000);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
