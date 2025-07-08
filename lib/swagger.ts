// lib/swagger.ts
import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const swaggerSpec = createSwaggerSpec({
    // THIS IS THE KEY PART:
    // It should point to the base directory of your API routes.
    // 'app/api' will make it look into app/api/fund/company/route.ts
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Your API Documentation', // Customize this
        version: '1.0',
      },
      // If you have security (e.g., JWT), define it here
      // security: [{ BearerAuth: [] }],
      // components: {
      //   securitySchemes: {
      //     BearerAuth: {
      //       type: 'http',
      //       scheme: 'bearer',
      //       bearerFormat: 'JWT',
      //     },
      //   },
      // },
    },
  });
  return swaggerSpec;
};