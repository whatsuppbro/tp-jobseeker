import { Elysia } from "elysia";

const app = new Elysia();
app.get("/", () => ({ message: "Hello Elysia" })).listen(5678);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
