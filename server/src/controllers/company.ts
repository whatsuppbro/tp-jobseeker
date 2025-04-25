import Elysia from "elysia";
import { t } from "elysia";
import { ErrorHandler, SuccessHandler } from "@/utils/Handler";
import {
  getCompanies,
  getCompanyById,
  getCompanyByUserId,
  createCompanyByUserId,
  createCompany,
  updateCompany,
  deleteCompany,
  updateCompanyById,
} from "@/services/company";
import { CompanyModel, CompanyAdminModel } from "@/db/models/company";
import {
  getVerifiedById,
  getVerifiedByCompany,
  updateVerified,
} from "@/services/company/verification";
import { VerificationModel } from "@/db/models/verification";

const controller = "company";

export const companyController = new Elysia({
  detail: {
    tags: [controller],
  },
}).group(controller, (app) =>
  app
    .get(`/`, async () => {
      try {
        const companies = await getCompanies();
        return SuccessHandler(companies);
      } catch (error) {
        return ErrorHandler(error);
      }
    })

    .get(`/:id`, async ({ params }) => {
      try {
        const company = await getCompanyById(params.id);
        if (!company) {
          throw new Error("Company not found");
        }
        return SuccessHandler(company);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .get(`/user/:id`, async ({ params }) => {
      try {
        const company = await getCompanyByUserId(params.id);
        if (!company) {
          throw new Error("Company not found");
        }
        return SuccessHandler(company);
      } catch (error) {
        return ErrorHandler(error);
      }
    })

    .post(
      `/`,
      async ({ body }) => {
        try {
          const company = await createCompany({ ...body });
          return SuccessHandler(company);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: CompanyModel,
      }
    )

    .post(
      `/:id`,
      async ({ params, body }) => {
        try {
          const company = await createCompanyByUserId(params.id, { ...body });
          return SuccessHandler(company);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        body: CompanyModel,
      }
    )

    .put(
      "/:id",
      async ({ params, body }) => {
        try {
          console.log("Incoming body:", body);
          const company = await updateCompany(params.id, body);
          if (!company) {
            throw new Error("Company not found");
          }
          return SuccessHandler(company);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: CompanyModel,
      }
    )

    .put(
      "/company/:id",
      async ({ params, body }) => {
        try {
          console.log("Incoming body:", body);
          const company = await updateCompanyById(params.id, body);
          if (!company) {
            throw new Error("Company not found");
          }
          return SuccessHandler(company);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: CompanyAdminModel,
      }
    )

    .delete("/:id", async ({ params }) => {
      try {
        const company = await deleteCompany(params.id);
        if (!company) {
          throw new Error("Company not found");
        }
        return SuccessHandler(company);
      } catch (error) {
        return ErrorHandler(error);
      }
    })
    .get(
      `/verification/:id`,
      async ({ params }) => {
        try {
          const verification = await getVerifiedById(params.id);
          return SuccessHandler(verification);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
      }
    )
    .get(
      `/verification/company/:id`,
      async ({ params }) => {
        try {
          const verification = await getVerifiedByCompany(params.id);
          return SuccessHandler(verification);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
      }
    )
    .put(
      `/verification/:id`,
      async ({ params, body }) => {
        try {
          const verification = await updateVerified(params.id, body);
          return SuccessHandler(verification);
        } catch (error) {
          return ErrorHandler(error);
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: VerificationModel,
      }
    )
);
