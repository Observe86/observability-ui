import { apiClient } from "@/api";

export async function login(params: { username: string; password: string }) {
  const endpoint = "/v1/auth/login";
  const { data } = await apiClient.post(endpoint, params);
  return data;
}

export async function logout(config = {}) {
  const endpoint = "/v1/auth/logout";
  await apiClient.post(endpoint, null, { ...config });
}

export async function refresh() {
  const endpoint = "/v1/auth/refresh";
  const { data } = await apiClient.post(endpoint);
  return data;
}
