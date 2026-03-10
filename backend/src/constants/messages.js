export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "User logged in successfully",
    REGISTER_SUCCESS: "User registered successfully",
    INVALID_CREDENTIALS: "Invalid email or password",
    USER_EXISTS: "User already exists with this email",
    UNAUTHORIZED: "Unauthorized access",
    TOKEN_EXPIRED: "Session expired, please login again"
  },
  URL: {
    CREATED: "Short URL created successfully",
    UPDATED: "Short URL updated successfully",
    DELETED: "Short URL deleted successfully",
    NOT_FOUND: "Short URL not found",
    EXPIRED: "This link has expired",
    COLLISION: "Short code already exists, please try another one",
    INVALID_URL: "Invalid original URL format"
  },
  GENERAL: {
    SERVER_ERROR: "Internal server error",
    BAD_REQUEST: "Bad request",
    VALIDATION_ERROR: "Validation failed",
    TOO_MANY_REQUESTS: "Too many requests, please try again later"
  }
};
