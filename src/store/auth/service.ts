import { createAsyncThunk } from "@reduxjs/toolkit";
import { authInstance } from "../../config/axios.config";
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
          : { url: "auth/me", method: "GET", params: {} };  

      // axios chaqiruv (to'g'ri usul bilan)
      const response = await authInstance.request(options);
      const _data = response.data;

      // 🔹 Tokenlarni saqlash
      if (_data?.access_token) {
        localStorage.setItem("access_token", _data?.access_token);
      }
      if (_data?.refresh_token) {
        localStorage.setItem("refresh_token", _data?.refresh_token);
      }

      return _data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  }
);

export default SignIn;

// 🔹 Token yangilash funksiyasi
// export const refreshToken = async (): Promise<AxiosResponse<TokenResponse>> => {
//   try {
//     const refresh_token = localStorage.getItem("refresh_token");
//     const device_id = localStorage.getItem("device_id");

//     if (refresh_token) {
//       const response = await instance.request({
//         url: "/auth/refresh-token",
//         method: "POST",
//         data: { refresh: refresh_token, device_id },
//       });

//       if ([200, 201].includes(response?.status)) {
//         localStorage.setItem("access_token", response?.data.access_token);
//         localStorage.setItem("refresh_token", response?.data.refresh_token);
//         localStorage.setItem("device_id", response?.data.device_id);
//         return response;
//       } else {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         localStorage.removeItem("device_id");
//         store.dispatch(logout());
//         throw new Error("Token refresh failed");
//       }
//     } else {
//       store.dispatch(logout());
//       throw new Error("No refresh token available");
//     }
//   } catch (error) {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("device_id");
//     window.location.href = "/login";
//     throw error;
//   }
// };
