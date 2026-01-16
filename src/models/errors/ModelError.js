// src/models/errors/ModelError.js

export const MODEL_ERROR_CODE = {
  VALIDATION: "VALIDATION",
  AUTH_INVALID: "AUTH_INVALID",
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  NETWORK: "NETWORK",
  EXTERNAL: "EXTERNAL",

  UNKNOWN: "UNKNOWN",
};

export class ModelError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = "ModelError";
    this.code = code;
    this.cause = cause;
  }
}
