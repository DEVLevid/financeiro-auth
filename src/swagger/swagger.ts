import { config } from "../config";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Financeiro Auth API",
    version: "1.0.0",
    description:
      "Authentication service for user registration, login, and token validation.",
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: "Local server",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "User authentication operations",
    },
    {
      name: "Health",
      description: "Service health check",
    },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Creates a new user account with email and password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User successfully registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterResponse" },
              },
            },
          },
          "400": {
            description: "Missing or invalid fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "409": {
            description: "Email already registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate user",
        description: "Validates credentials and returns an access token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          "400": {
            description: "Missing or invalid fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/validate": {
      post: {
        tags: ["Auth"],
        summary: "Validate access token",
        description:
          "Orchestrator-only endpoint. Checks whether a token is valid and returns user data.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ValidateRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Token is valid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidateSuccessResponse" },
              },
            },
          },
          "400": {
            description: "Missing or invalid fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Token is invalid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidateErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        description: "Revokes the access token and ends the session.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LogoutRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LogoutResponse" },
              },
            },
          },
          "400": {
            description: "Missing or invalid fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Service is running",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "vinicius@email.com",
          },
          senha: {
            type: "string",
            example: "123456",
          },
        },
      },
      RegisterResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          email: { type: "string", example: "vinicius@email.com" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "vinicius@email.com",
          },
          senha: {
            type: "string",
            example: "123456",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "abc123" },
        },
      },
      ValidateRequest: {
        type: "object",
        required: ["token"],
        properties: {
          token: { type: "string", example: "abc123" },
        },
      },
      LogoutRequest: {
        type: "object",
        required: ["token"],
        properties: {
          token: { type: "string", example: "abc123" },
        },
      },
      LogoutResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "logged out successfully" },
        },
      },
      ValidateSuccessResponse: {
        type: "object",
        properties: {
          valid: { type: "boolean", example: true },
          userId: { type: "integer", example: 1 },
          email: { type: "string", example: "vinicius@email.com" },
        },
      },
      ValidateErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "invalid token" },
          valid: { type: "boolean", example: false },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "email and password are required" },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
        },
      },
    },
  },
};
