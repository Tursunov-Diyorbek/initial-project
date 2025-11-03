import store from "../../store";
import { logout } from "../../store/auth";
import { AxiosError } from "axios";
import { message } from "antd";

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

  private 401(): void {
    store.dispatch(logout());
    // window.location.href = "/signin";
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
