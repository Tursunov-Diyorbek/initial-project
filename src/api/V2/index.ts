import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { message } from "antd";
import { refreshToken } from "../auth_api";
import { PATH_PREFIX_V2 } from "@/utils/AppVariables";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

const API_V2: AxiosInstance = axios.create({
  baseURL: PATH_PREFIX_V2,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

const logout = () => {
  [
    "token",
    "refresh_token",
    "roles",
    "permissions",
    "user_profile_name",
    "device_id",
  ].forEach(key => localStorage.removeItem(key));

  message.error("Sessiya muddati tugadi. Iltimos, qayta tizimga kiring.");
  window.location.href = "/login";
};

const errorHandler = (error: AxiosError<any>): void => {
  const { response } = error;

  if (!response) {
    message.error("Tarmoqda uzilish! Internetni tekshiring yoki keyinroq urinib ko‘ring.");
    return;
  }

  const { status, data } = response;

  if (status === 401) return; // handled separately

  const messages: Record<number, string> = {
    403: data?.message || "Ruxsat yo‘q.",
    404: "So‘ralgan resurs topilmadi.",
    500: "Serverda xatolik. Iltimos, keyinroq urinib ko‘ring.",
  };

  if (status === 422 && (data?.errors || data?.validator_errors)) {
    const firstError = Object.values(data.errors || data.validator_errors)[0];
    message.error(Array.isArray(firstError) ? firstError[0] : firstError);
    return;
  }

  message.error(messages[status] || data?.message || "Noma’lum xatolik yuz berdi.");
};

// ✅ To‘g‘rilangan request interceptor
API_V2.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    const language = localStorage.getItem("language") || "uz";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Accept-Language"] = language;

    return config;
  },
  error => Promise.reject(error)
);

// ✅ Response interceptor
API_V2.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (status === 401 && originalRequest.url?.includes("/auth/refresh-token")) {
      processQueue(error, null);
      logout();
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/refresh-token")) {
      const refresh_token = localStorage.getItem("refresh_token");
      const device_id = localStorage.getItem("device_id");

      if (!refresh_token || !device_id) {
        logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (token) originalRequest.headers.Authorization = `Bearer ${token}`;
          return API_V2(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshToken(refresh_token, device_id);
        const { access_token, refresh_token: new_refresh }: TokenResponse = response.data;

        localStorage.setItem("token", access_token);
        localStorage.setItem("refresh_token", new_refresh);

        API_V2.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        processQueue(null, access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return API_V2(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status !== 401) errorHandler(error);
    return Promise.reject(error);
  }
);

export default API_V2;
