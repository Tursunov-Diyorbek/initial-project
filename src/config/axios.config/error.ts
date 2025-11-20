import store from "../../store";
import { logout } from "../../store/auth";
import { AxiosError } from "axios";
import { message } from "antd";
import { refreshToken } from "@/api/auth_api";
import SignIn from "@/store/auth/service";

export class ResponseError {
  error!: AxiosError<any>;

  constructor(error: AxiosError<any>) {
    console.log("error", error);
    this.error = error;
    this.errors(error.response?.status);
  }

  private errors(status: number | undefined) {
    switch (status) {
      case 400:
        this[400]();
        break;
      case 401:
        this[401]();
        break;
      case 403:
        this[403]();
        break;
      case 404:
        this[404]();
        break;
      case 422:
        this[422]();
        break;
      case 500:
        this[500]();
        break;
      default:
        this.withoutStatusError();
    }
  }

  private 400(): void {
    message.error(this?.error?.response?.data?.data);
  }

  private async 401(): Promise<void> {
    const refresh_token = localStorage.getItem("refresh_token");
    const device_id = localStorage.getItem("device_id");

    if (refresh_token && device_id) {
      try {
        const response = await refreshToken(refresh_token, device_id);
        if (response?.access_token) {
          localStorage.setItem("access_token", response.access_token);
          localStorage.setItem("refresh_token", response.refresh_token);
          store.dispatch(SignIn({ data: null, type: "me" }));

          // Token yangilandi, qayta urinish mumkin
          return;
        } else {
          // Response success bo'lmadi (access_token yo'q)
          store.dispatch(logout());
          window.location.href = "/login";
          return;
        }
      } catch (error) {
        // Token yangilash muvaffaqiyatsiz, logout qilish kerak
        console.error("Token refresh failed:", error);
        store.dispatch(logout());
        window.location.href = "/login";
        return;
      }
    }

    // Token yangilash muvaffaqiyatsiz yoki refresh_token yo'q
    store.dispatch(logout());
    window.location.href = "/login";
  }

  private 403(): void {
    message.error("Faydalanish huquqi yo'q!");
  }

  private 404(): void {
    message.error("Ma'lumot topilmadi!");
  }
  private 422(): void {}
  private 500(): void {
    message.error(this.error.message);
  }

  private withoutStatusError() {}
}
