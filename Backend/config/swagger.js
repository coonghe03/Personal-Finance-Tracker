import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Personal Finance Tracker",
        version: "0.1.0",
        description: "API Documentation for personal finance tracker",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "LogRocket",
          url: "https://logrocket.com",
          email: "info@email.com",
        },
      },
      servers: [
        {
          url: "http://localhost:4000",
          description: "Local Server"
        },
      ],
    },
    apis: ["./routes/*.js"], 
};

// Corrected variable name from "swaggerSpec" to "specs"
const specs = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs)); // Fixed variable name
    console.log("Swagger docs available at http://localhost:4000/api-docs");
};

export default swaggerDocs;
