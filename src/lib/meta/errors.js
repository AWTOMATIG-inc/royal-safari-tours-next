export class MetaError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MetaConfigurationError extends MetaError {
  constructor(message) {
    super(message, "CONFIG_ERROR", 500);
  }
}

export class MetaAuthenticationError extends MetaError {
  constructor(message) {
    super(message, "AUTHENTICATION_FAILED", 401);
  }
}

export class MetaPermissionError extends MetaError {
  constructor(message) {
    super(message, "PERMISSION_DENIED", 403);
  }
}

export class MetaRateLimitError extends MetaError {
  constructor(message) {
    super(message, "RATE_LIMIT_EXCEEDED", 429);
  }
}

export class MetaValidationError extends MetaError {
  constructor(message) {
    super(message, "VALIDATION_FAILED", 400);
  }
}

export class MetaNetworkError extends MetaError {
  constructor(message) {
    super(message, "NETWORK_ERROR", 503);
  }
}

export class MetaApiError extends MetaError {
  constructor(message, code, status) {
    super(message, code, status);
  }
}
