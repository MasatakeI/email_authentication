// models/errors/ModelError.js

export const MODEL_ERROR_CODE = {
  NOT_FOUND: "NOT_FOUND",
  VALIDATION: "VALIDATION",
  INVALID_DATA: "INVALID_DATA",
  FORBIDDEN: "FORBIDDEN",
};

export class ModelError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ModelError";
    this.code = code;
  }
}
