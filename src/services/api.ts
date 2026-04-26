import axios from "axios";
import type { AxiosInstance } from "axios";
import { AppConfigError } from "../errors/AppConfigError";

const requiredEnv = (value: string | undefined) => {
  if (!value) {
    throw new AppConfigError();
  }

  return value;
};

let apiClient: AxiosInstance | null = null;

export const getApiClient = () => {
  if (apiClient) {
    return apiClient;
  }

  apiClient = axios.create({
    baseURL: requiredEnv(import.meta.env.VITE_API_URL),
    timeout: 5000,
  });

  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
  });

  return apiClient;
};
