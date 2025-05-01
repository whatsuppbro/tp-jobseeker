import Elysia from "elysia";
import { userController } from "./user";
import { companyController } from "./company";
import { seekerController } from "./seeker";
import { experienceController } from "./experience";
import { jobsController } from "./jobs";
import { applicationController } from "./application";
import { adminController } from "./admin";
import { verificationController } from "./verification";

export default new Elysia()
  .use(userController)
  .use(companyController)
  .use(seekerController)
  .use(experienceController)
  .use(jobsController)
  .use(applicationController)
  .use(adminController)
  .use(verificationController);
