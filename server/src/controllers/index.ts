import Elysia from "elysia";
import { userController } from "./user";
import { companyController } from "./company";
import { seekerController } from "./seeker";
import { experienceController } from "./experience";

export default new Elysia()
  .use(userController)
  .use(companyController)
  .use(seekerController)
  .use(experienceController);
