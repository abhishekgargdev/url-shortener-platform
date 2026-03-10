export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me"
  },
  URL: {
    CREATE: "/api/url/create",
    LIST: "/api/url/list",
    UPDATE: "/api/url/:id",
    DELETE: "/api/url/:id"
  },
  ANALYTICS: {
    GET_BY_URL: "/api/analytics/:id"
  }
};

export const REDIRECT_ROUTE = "/:shortCode";
