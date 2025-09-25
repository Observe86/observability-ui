/**
 * Most of the logic in this component is originally from the following article:
 * https://dev.to/amitkumar13/seamlessly-handling-api-401-errors-in-react-native-automatic-token-refresh-with-axios-interceptors-h9g
 */
"use client";

import { useRouter } from "next/navigation";

import { apiClient } from "@/api";
import { logout, refresh } from "@/api/auth";
import { clearAccessToken, getAccessToken, storeAccessToken } from "@/utils/token";

import { useDictionary } from "./dictionary-provider";

interface IProps {
  children: React.ReactNode;
}

export const AxiosProvider = ({ children }: IProps) => {
  const { lang } = useDictionary();

  const accessToken = getAccessToken();
  if (accessToken) {
    apiClient.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Send the language to the backend for localization
  apiClient.defaults.headers["Accept-Language"] = lang;

  const router = useRouter();

  let isRefreshing = false;

  // Create a list to hold the request queue
  const refreshAndRetryQueue: any[] = [];

  // Axios interceptor
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          console.error("401 error", error.response);

          // Skip handling for requests marked to bypass the interceptor
          if (originalRequest.skip401Interceptor) {
            return Promise.reject(error);
          }

          if (!isRefreshing && !originalRequest._retry) {
            isRefreshing = true;

            try {
              // Refresh the access token
              const newAccessToken = await refresh();

              if (newAccessToken) {
                originalRequest._retry = true;

                // Update the request headers with the new access token
                storeAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Update the axios instance with the new access token for future requests
                apiClient.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;

                // Retry all requests in the queue with the new token
                refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                  config.headers.Authorization = `Bearer ${newAccessToken}`;

                  apiClient
                    .request(config)
                    .then((response) => resolve(response))
                    .catch((err) => reject(err));
                });

                // Clear the queue
                refreshAndRetryQueue.length = 0;

                // Retry the original request
                return apiClient(originalRequest);
              }
            } catch (refreshError) {
              console.error("Error refreshing token:", refreshError);
              // Handle token refresh error
              try {
                await logout({ skip401Interceptor: true }); // Pass the skip flag
              } catch (logoutError) {
                console.error("Error during logout:", logoutError);
              } finally {
                clearAccessToken();
                router.push(`/${lang}/login`);
              }
            } finally {
              isRefreshing = false;
            }
          }

          // Add the original request to the queue
          return new Promise((resolve, reject) => {
            refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
          });
        }
      }

      return Promise.reject(error);
    },
  );

  return <>{children}</>;
};
