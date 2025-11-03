import { createAsyncThunk } from "@reduxjs/toolkit";
import instance, { authInstance } from "../../config/axios.config";
import { logout } from "./index";
import store from "..";
import type { AxiosRequestConfig } from "axios";

// 🔹 LOGIN yoki ME uchun async thunk
const SignIn = createAsyncThunk(
  "user/SignIn",
  async (
    data: { type: string; data?: any; role?: string },
    { rejectWithValue }
  ) => {
    try {
      const options: AxiosRequestConfig =
        data.type === "login"
          ? { url: "login", method: "POST", data: data?.data ?? null }
          : { url: "me", method: "GET", params: {} };

      // axios chaqiruv (to'g'ri usul bilan)
      const response = await authInstance.request(options);
      const _data = response.data;

      console.log("_data", _data);

      // 🔹 Tokenlarni saqlash
      if (_data?.data?.access) {
        localStorage.setItem("access_token", _data.data.access);
      }
      if (_data?.data?.refresh) {
        localStorage.setItem("refresh_token", _data.data.refresh);
      }

      return _data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export default SignIn;

// 🔹 Token yangilash funksiyasi
export const refreshToken = async () => {
  try {
    const refresh_token = localStorage.getItem("refresh_token");

    if (refresh_token) {
      const response = await instance.request({
        url: "/base/token-refresh/",
        method: "POST",
        data: { refresh: refresh_token },
      });

      if (response?.status === 200 || response?.status === 201) {
        localStorage.setItem("access_token", response?.data.access);
        localStorage.setItem("refresh_token", response?.data.refresh);
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/signin";
      }
    } else {
      store.dispatch(logout());
    }
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/signin";
  }
};
