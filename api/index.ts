import axios from "axios";

import { env } from "@/env";

/**
 * This axios instance should be used for all API requests.
 * Currently it uses the V1 API URL.
 */
export const apiClient = axios.create({
  baseURL: env.apiGatewayUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
